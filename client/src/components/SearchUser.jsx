import { useEffect, useState } from "react";
import { IoClose, IoSearchOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "./Loader";
import UserSearchCard from "./UserSearchCard";

function SearchUser({ onClose }) {
  const [searchUser, setSearchUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleSearch = async () => {
      try {
        setIsLoading(true);
        const response = await axios({
          method: "POST",
          url: `${import.meta.env.VITE_APP_BACKEND_URL_DEV}/search-users`,
          data: {
            search: query,
          },
        });
        setSearchUser(response.data.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error(error.message);
      }
    };
    handleSearch();
  }, [query]);

  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 bg-slate-700 bg-opacity-40 p-2">
      <div className="w-full max-w-lg mx-auto mt-10">
        <div className="bg-white rounded flex overflow-hidden items-center">
          <input
            type="text"
            placeholder="Search User by name, email...."
            className="w-full outline-none py-1 h-full px-4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="h-14 w-14 flex justify-center items-center">
            <IoSearchOutline size={25} />
          </div>
        </div>
        <div className="bg-white mt-2 w-full p-4 rounded">
          {searchUser.length === 0 && !isLoading && (
            <p className="text-center text-slate-500">No User found !</p>
          )}
          {isLoading && <Loader />}

          {searchUser.length > 0 &&
            !isLoading &&
            searchUser.map((user) => (
              <UserSearchCard key={user._id} user={user} onClose={onClose} />
            ))}
        </div>
      </div>

      <div
        className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-primary cursor-pointer bg-white border rounded-full m-2"
        onClick={onClose}
      >
        <IoClose size={25} />
      </div>
    </div>
  );
}

export default SearchUser;
