require("dotenv").config();
const express = require("express");
const { connectDB } = require("./configs/database");
const cookieParser = require("cookie-parser");
const { createServer } = require("http");
const cors = require("cors");
const auth = require("./router/auth");
const profile = require("./router/profile");
const router = require("./router/request");
const user = require("./router/user");
const initialiseSocket  = require("./utils/Socket");

const app = express();
app.use(cors({ origin: process.env.FrontendURL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", auth);
app.use("/", profile);
app.use("/", router);
app.use("/", user);

const httpServer = createServer(app);
initialiseSocket(httpServer);

connectDB()
  .then(() => {
    httpServer.listen(process.env.PORT, () => {
      console.log("Server Started Successfully!");
    });
  })
  .catch((err) => {
    console.log("OOPS Error occurred!", err);
  });
