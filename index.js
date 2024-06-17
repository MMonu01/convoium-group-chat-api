const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { roomRouter } = require("./routes/room-router.js");
const { messageRouter } = require("./routes/message-router.js");

const { Connection } = require("./config/db.js");

const PORT = process.env.PORT || 9000;

const app = express();
app.use(cors({ origin: process.env.PROJECT_URL, credentials: true }));

app.use(express.json());

app.use("/room", roomRouter);
app.use("/message", messageRouter);

Connection.then(() => {
  console.log("connection to db successfull");
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
}).catch((err) => {
  console.log("failed to connect to db", err);
});
