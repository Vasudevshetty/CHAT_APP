import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import { useState } from "react";
import EditUserDetails from "./EditUserDetails";

function Sidebar() {
  const [userEditOpen, setUserEditOpen] = useState(false);
  const user = useSelector((state) => state?.user);

  return (
    <div className="w-full h-full">
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

      {userEditOpen && (
        <EditUserDetails onClose={() => setUserEditOpen(false)} user={user} />
      )}
    </div>
  );
}

export default Sidebar;
