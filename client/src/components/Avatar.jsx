import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

function Avatar({ userId, name, imageUrl, width, height }) {
  const onlineUser = useSelector((state) => state.user?.onlineUser);
  const isOnline = onlineUser.includes(userId);

  let avatarName = "";
  if (name) {
    const splitName = name?.split(" ");
    if (splitName.length > 1) avatarName = splitName[0][0] + splitName[1][0];
    else avatarName = splitName[0][0];
  }
  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-grey-200",
    "bg-cyan-200",
    "bg-sky-200",
    "bg-blue-200",
  ];

  return (
    <div
      className={`text-slate-800 font-bold rounded-full relative`}
      style={{
        width: width + "px",
        height: height + "px",
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          width={width}
          height={height}
          className="overflow-hidden rounded-full"
        />
      ) : name ? (
        <div
          className={`overflow-hidden text-lg rounded-full flex justify-center items-center ${
            bgColor[Math.floor(Math.random() * bgColor.length)]
          }`}
          style={{
            width: width + "px",
            height: height + "px",
          }}
        >
          {avatarName}
        </div>
      ) : (
        <PiUserCircle size={width} />
      )}

      {isOnline && (
        <div className="bg-green-600 p-1 rounded-full absolute bottom-2 right-0 z-10"></div>
      )}
    </div>
  );
}

export default Avatar;
