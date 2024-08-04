const mongoose = require("mongoose");

async function conntectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Connnecttion to DB succesfull");
    });

    connection.on("error", (err) => {
      console.log("Something is wrong in mongodb", error);
    });
  } catch (err) {
    console.log("Somethign is wrong", err);
  }
}

module.exports = conntectDB;
