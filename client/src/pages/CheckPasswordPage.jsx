import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { setToken } from "../redux/userSlice";

function CheckPasswordPage() {
  const location = useLocation();
  const [data, setData] = useState({
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) navigate("/email");
  }, [location, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios({
        method: "POST",
        url: `${import.meta.env.VITE_APP_BACKEND_URL_DEV}/api/password`,
        data: {
          userId: location.state?._id,
          password: data.password,
        },
        withCredentials: true,
      });
      toast.success(response.data.message);

      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setData({ password: "" });
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-8">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 items-center flex flex-col justify-center">
          <Avatar
            width={70}
            height={70}
            name={location.state?.name}
            imageUrl={location.state?.profile_pic}
          />
          <h2 className="font-semibold text-lg mt-1">{location.state?.name}</h2>
        </div>
        <h3>Welcome to chat app!</h3>

        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>
          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary mt-2 font-bold text-white leading-tight tracking-wide">
            Login
          </button>
        </form>

        <p className="my-3 text-center">
          <Link
            to={"/forgot-password"}
            className="hover:text-primary font-semibold"
          >
            Fogot password !
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CheckPasswordPage;
