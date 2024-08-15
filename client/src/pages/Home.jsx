import { Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "../redux/userSlice";
import Sidebar from "../components/Sidebar";

function Home() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios({
          url: `${import.meta.env.VITE_APP_BACKEND_URL_DEV}/user-details`,
          withCredentials: true,
        });

        dispatch(setUser(response.data.data));

        if (response.data.logout) {
          dispatch(logout());
          navigate("/email");
        }
      } catch (error) {
        toast(error.message);
      }
    }

    fetchUser();
  }, [dispatch, navigate]);

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className="bg-white">
        <Sidebar />
      </section>
      <section>
        <Outlet />
      </section>
    </div>
  );
}

export default Home;
