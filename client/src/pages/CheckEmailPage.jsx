import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { PiUserCircle } from "react-icons/pi";
import toast from "react-hot-toast";

function CheckEmailPage() {
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL_DEV}/api/email`,
        data
      );
      toast.success(response.data.message);

      if (response.data.success) {
        setData({ email: "" });
        navigate("/password", {
          state: response.data.data,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-8">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2">
          <PiUserCircle size={80} />
        </div>
        <h3>Welcome to chat app!</h3>

        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>
          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary mt-2 font-bold text-white leading-tight tracking-wide">
            {"Let's go"}
          </button>
        </form>

        <p className="my-3 text-center">
          Dont have an account ?{" "}
          <Link to={"/register"} className="hover:text-primary font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CheckEmailPage;
