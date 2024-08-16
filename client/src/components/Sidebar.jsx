import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { FiArrowUpLeft } from "react-icons/fi";
import EditUserDetails from "./EditUserDetails";
import Avatar from "./Avatar";
import SearchUser from "./SearchUser";

function Sidebar() {
  const [userEditOpen, setUserEditOpen] = useState(false);
  const [searchUserOpen, setSearchUserOpen] = useState(false);
  const user = useSelector((state) => state?.user);
  const socketConnection = useSelector((state) => state.user.socketConnection);
  const [allUser, setAllUser] = useState([]);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);

      socketConnection.on("conversations", (data) => {
      });
    }
  }, [socketConnection, user._id]);

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr]">
      <div className="h-full bg-slate-100 w-12 rounded-tr-md rounded-br-md py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <NavLink
            className={(isActive) =>
              `w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-slate-200 rounded ${
                isActive && "bg-slate-200"
              }`
            }
            title="chat"
          >
            <IoChatbubbleEllipses size={20} />
          </NavLink>
          <div
            className="w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-slate-200 rounded"
            title="add friend"
            onClick={() => setSearchUserOpen(true)}
          >
            <FaUserPlus size={20} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <button
            className="mx-auto"
            title={user.name}
            onClick={() => setUserEditOpen(true)}
          >
            <Avatar
              width={40}
              height={40}
              name={user.name}
              imageUrl={user.profile_pic}
              userId={user._id}
            />
          </button>
          <button
            className="w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-slate-200 rounded"
            title="logout"
          >
            <span className="-ml-1">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex  items-center">
          <h2 className="font-bold text-xl p-4 text-slate-800">Message</h2>
        </div>
        <div className="py-[0.5px] bg-slate-200"></div>

        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length == 0 && (
            <div className="mt-12">
              <div className="flex justify-center text-slate-500 my-4">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Create a new friend to chat with !
              </p>
            </div>
          )}
        </div>
      </div>

      {userEditOpen && (
        <EditUserDetails onClose={() => setUserEditOpen(false)} user={user} />
      )}

      {searchUserOpen && (
        <SearchUser onClose={() => setSearchUserOpen(false)} />
      )}
    </div>
  );
}

export default Sidebar;
