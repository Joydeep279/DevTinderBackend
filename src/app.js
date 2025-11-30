const express = require("express");
const app = express();
const { connectDB } = require("./configs/database");
const cookieParser = require("cookie-parser");
var cors = require("cors");

const auth = require("./router/auth");
const profile = require("./router/profile");
const router = require("./router/request");
const user = require("./router/user");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/", auth);
app.use("/", profile);
app.use("/", router);
app.use("/", user);

connectDB()
  .then(() => {
    app.listen(7777, () => {
      console.log("Server Started Successfully!");
    });
  })
  .catch((err) => {
    console.log("OOPS Error occurred!", err);
  });
