const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getDataFromToken = require("../helpers/getDataFromToken");
const User = require("../models/userModel");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("Connected user", socket.id);
  const token = socket.handshake.auth.token;

  // current user details
  const user = await getDataFromToken(token);
  socket.join(user?._id);
  onlineUser.add(user?._id.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    const userDetails = await User.findById(userId).select("-password");

    const payload = {
      name: userDetails.name,
      _id: userDetails._id,
      email: userDetails.email,
      profile_pic: userDetails.profile_pic,
      online: onlineUser.has(userId),
    };

    socket.emit("message-user", payload);
  });

  socket.on("disconnect", () => {
    onlineUser.delete(user?._id);
    console.log("Disconnected user", socket.id);
  });
});

module.exports = {
  app,
  server,
};
