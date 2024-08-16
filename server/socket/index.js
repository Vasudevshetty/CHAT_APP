const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getDataFromToken = require("../helpers/getDataFromToken");
const User = require("../models/userModel");
const Conversation = require("../models/conversationModel");
const Message = require("../models/MessageModel");

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
  socket.join(user?._id.toString());
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

    const getConversationMessage = await Conversation.findOne({
      $or: [
        { sender: user._id, receiver: userId },
        { sender: userId, receiver: user._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });
    socket.emit("message", getConversationMessage);
  });

  socket.on("new-message", async (data) => {
    // check conversation is present or not
    let conversation = await Conversation.findOne({
      $or: [
        { sender: data.sender, receiver: data.receiver },
        { sender: data.receiver, receiver: data.sender },
      ],
    });

    // conversation not avialble
    if (!conversation) {
      const createConversation = await Conversation({
        sender: data.sender,
        receiver: data.receiver,
      });
      conversation = await createConversation.save();
    }

    const message = await Message({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUserId: data.msgByUserId,
    });
    const saveMessage = await message.save();

    const updateConversations = await Conversation.updateOne(
      {
        _id: conversation._id,
      },
      {
        $push: { messages: saveMessage._id },
      }
    );

    const getConversationMessage = await Conversation.findOne({
      $or: [
        { sender: data.sender, receiver: data.receiver },
        { sender: data.receiver, receiver: data.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("message", getConversationMessage);
    io.to(data?.receiver).emit("message", getConversationMessage);
  });

  socket.on("sidebar", async (currentUserId) => {
    const userConversation = await Conversation.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    }).sort({ updatedAt: -1 });

    const conversation = userConversation.map((message) => {
      return {
        ...m
      }
    })

    socket.emit("conversations", userConversation);
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
