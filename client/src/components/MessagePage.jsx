import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaImage, FaPlus, FaVideo } from "react-icons/fa";
import uploadFile from "../helpers/uploadFile";
import { IoClose } from "react-icons/io5";
import moment from "moment";
import { IoMdSend } from "react-icons/io";
import Loader from "./Loader";

function MessagePage() {
  const { userId } = useParams();
  const user = useSelector((state) => state.user);
  const socketConnection = useSelector((state) => state.user.socketConnection);
  const [data, setData] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const [allMessages, setAllMessages] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const currentMessageRef = useRef(null);

  useEffect(() => {
    if (currentMessageRef.current)
      currentMessageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
  }, [allMessages]);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", userId);

      socketConnection.on("message-user", (data) => {
        setData(data);
      });

      socketConnection.on("message", (data) => {
        setAllMessages(data.messages);
      });
    }
  }, [socketConnection, userId, user]);

  const handleUploadImageClear = async () => {
    setMessage((message) => {
      return { ...message, imageUrl: "" };
    });
  };

  const handleUploadVideoClear = async () => {
    setMessage((message) => {
      return { ...message, videoUrl: "" };
    });
  };

  const handleUploadImage = async (e) => {
    setIsLoading(true);
    setIsUploadOpen(false);
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setMessage((message) => {
      return { ...message, imageUrl: uploadPhoto.url };
    });
    setIsLoading(false);
  };

  const handleUploadVideo = async (e) => {
    setIsLoading(true);
    setIsUploadOpen(false);
    const file = e.target.files[0];
    const uploadVideo = await uploadFile(file);
    setMessage((message) => {
      return { ...message, videoUrl: uploadVideo.url };
    });
    setIsLoading(false);
  };

  const handleMessageText = (e) => {
    const { value } = e.target;
    setMessage((message) => {
      return { ...message, text: value };
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new-message", {
          sender: user._id,
          receiver: userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user._id,
        });
      }
      setMessage({
        text: "",
        imageUrl: "",
        videoUrl: "",
      });
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/wallpaper.jpeg')",
      }}
      className="bg-no-repeat bg-cover "
    >
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/"}>
            <FaAngleLeft size={20} />
          </Link>
          <div>
            <Avatar
              name={data.name}
              height={50}
              width={50}
              imageUrl={data.profile_pic}
              userId={data._id}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold my-0 text-ellipsis line-clamp-1">
              {data.name}
            </h3>
            <p className="-my-2 text-sm">
              {data.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400 ">offline</span>
              )}
            </p>
          </div>
        </div>

        <div>
          <button className="cursor-pointer hover:text-primary">
            <HiDotsVertical />
          </button>
        </div>
      </header>

      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar bg-slate-200 bg-opacity-50">
        <div className="flex flex-col gap-2 py-2 mx-2 " ref={currentMessageRef}>
          {allMessages.map((message) => (
            <div
              key={message._id}
              className={`bg-white p-1 rounded w-fit ${
                user._id === message.msgByUserId ? "ml-auto bg-teal-400" : ""
              } max-[280px] md:max-w-sm lg:max-w-md`}
            >
              <div className="w-full">
                {message.imageUrl && (
                  <img
                    src={message.imageUrl}
                    alt="image"
                    className="h-full w-full object-scale-down"
                  />
                )}
                {message.videoUrl && (
                  <video
                    src={message.videoUrl}
                    autoPlay
                    controls
                    muted
                    className="h-full w-full object-scale-down"
                  />
                )}
              </div>
              <p className="px-2">{message.text}</p>
              <p className="text-xs ml-auto w-fit text-slate-500">
                {moment(message.createdAt).format("hh:mm:ss")}
              </p>
            </div>
          ))}
        </div>

        {message.imageUrl && (
          <div className="h-full sticky bottom-0 w-full bg-slate-700 bg-opacity-55 flex justify-center items-center">
            <div
              className="w-fit absolute top-0 right-0 p-3 cursor-pointer hover:text-primary"
              onClick={handleUploadImageClear}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                alt="message (image)"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}
        {message.videoUrl && (
          <div className="h-full sticky bottom-0 w-full bg-slate-700 bg-opacity-55 flex justify-center items-center">
            <div
              className="w-fit absolute top-0 right-0 p-3 cursor-pointer hover:text-primary"
              onClick={handleUploadVideoClear}
            >
              <IoClose size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                alt="message (video)"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center items-center h-full w-full sticky bottom-0">
            <Loader />
          </div>
        )}
      </section>

      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative">
          <button
            className="flex justify-center items-center h-11 w-11 rounded-full hover:bg-primary hover:text-white"
            onClick={() => setIsUploadOpen((isOpen) => !isOpen)}
          >
            <FaPlus size={20} />
          </button>
          {isUploadOpen && (
            <div className="bg-white rounded absolute bottom-14 w-36 p-2 shadow">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-primary">
                    <FaImage />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <FaVideo />
                  </div>
                  <p>Video</p>
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  className="hidden"
                  onChange={handleUploadImage}
                />
                <input
                  type="file"
                  id="uploadVideo"
                  className="hidden"
                  onChange={handleUploadVideo}
                />
              </form>
            </div>
          )}
        </div>

        <form className="h-full w-full flex" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Say hi..."
            className="py-1 px-4 outline-none h-full w-full"
            value={message.text}
            onChange={handleMessageText}
          />
          <button className="hover:text-primary">
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
}

export default MessagePage;
