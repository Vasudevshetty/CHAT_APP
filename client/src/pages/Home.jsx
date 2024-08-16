import { Outlet, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout, setUser } from "../redux/userSlice";
import io from "socket.io-client";
import Sidebar from "../components/Sidebar";

function Home() {
  // const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname === "/";

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios({
          url: `${import.meta.env.VITE_APP_BACKEND_URL_DEV}/api/user-details`,
          withCredentials: true,
        });

        dispatch(setUser(response.data.data));

        if (response.data.data.logout) {
          dispatch(logout());
          navigate("/email");
        }
      } catch (error) {
        toast(error.message);
      }
    }

    fetchUser();
  }, [dispatch, navigate]);

  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_APP_BACKEND_URL_DEV, {
      withCredentials: true,
      auth: {
        token: localStorage.getItem("token"),
      },
      transports: ["websocket", "polling"],
    });

    socketConnection.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`${!basePath && "hidden"} lg:block bg-white`}>
        <Sidebar />
      </section>
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      {basePath && (
        <div className="lg:flex justify-center items-center flex-col gap-2 hidden">
          <div>
            <img src="/logo.png" alt="logo" width={250} />
            <p className="text-lg mt-2 text-slate-500">
              Select a user to send message!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
