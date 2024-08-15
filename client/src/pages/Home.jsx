import { Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";

function Home() {
  async function fetchUser() {
    try {
      const response = await axios({
        url: `${import.meta.env.VITE_APP_BACKEND_URL_DEV}/user-details`,
        withCredentials: true,
      });
      console.log(response);
    } catch (error) {
      toast(error.message);
    }
  }
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      Home
      <section>
        <Outlet />
      </section>
    </div>
  );
}

export default Home;
