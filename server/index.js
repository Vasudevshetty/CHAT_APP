const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./config/connectDB");
const router = require("./routes/index");
const { app, server } = require("./socket/index");

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send({ message: "hello from server" });
});

app.use("/api", router);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
});
