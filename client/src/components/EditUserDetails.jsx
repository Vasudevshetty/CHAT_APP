import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import uploadFile from "../helpers/uploadFile";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

function EditUserDetails({ onClose, user }) {
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic,
  });

  useEffect(() => {
    setData((data) => {
      return { ...data, ...user };
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((data) => {
      return { ...data, [name]: value };
    });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    const uploadPhoto = await uploadFile(file);

    setData((data) => {
      return { ...data, profile_pic: uploadPhoto?.url };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios({
        method: "POST",
        url: `${import.meta.env.VITE_APP_BACKEND_URL_DEV}/api/update`,
        data,
        withCredentials: true,
      });
      toast.success(response.data.message);
      if (response.data.success) {
        dispatch(setUser(response.data.data));
        onClose();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center">
      <div className="bg-white px-4 py-6 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm">Edit user details</p>

        <form onSubmit={handleSubmit} className="grid gap-3 mt-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleChange}
              className="w-full py-1 px-2 focus:outline-primary border-0.5 bg-slate-100"
            />
          </div>

          <div>
            Photo:
            <div className="my-1 flex items-center gap-4">
              <Avatar
                width={40}
                height={40}
                imageUrl={data.profile_pic}
                name={data.name}
              />
              <label htmlFor="profile_pic">
                <button
                  className="font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    uploadPhotoRef.current.click();
                  }}
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  id="profile_pic"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>

          <div className="p-[0.5px] bg-slate-200 mt-1"></div>

          <div className="flex gap-2 ml-auto ">
            <button
              className="border-primary border px-4 py-1 text-primary rounded hover:bg-primary hover:text-white"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="border-primary border px-4 py-1 bg-primary text-white rounded hover:bg-secondary"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserDetails;
