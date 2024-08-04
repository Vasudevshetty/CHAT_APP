const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const conntectDB = require("./config/connectDB");
const router = require("./routes/index");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send({ message: "hello from server" });
});

app.use("/api", router);

conntectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
});
