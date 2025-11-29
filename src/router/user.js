const express = require("express");
const auth = require("../middlewares/auth");
const Connection = require("../configs/connectionSchema");
const router = express.Router();
const User = require("../configs/databaseSchema");

router.get("/user/requests", auth, async (req, res) => {
  try {
    const { _id } = req.userData;
    const requestsList = await Connection.find({
      toUser: _id,
      status: "interested",
    }).populate("fromUser", ["firstName", "lastName", "profileURL"]);
    const data = requestsList.map((items) => items.fromUser);
    res.json({ data });
  } catch (error) {
    throw new Error("MESSAGE: ", error.message);
  }
});

router.get("/user/connections", auth, async (req, res) => {
  try {
    const { _id } = req.userData;

    const allConnections = await Connection.find({
      $or: [
        { fromUser: _id, status: "accepted" },
        { toUser: _id, status: "accepted" },
      ],
    })
      .populate("fromUser", ["firstName", "lastName", "profileURL"])
      .populate("toUser", ["firstName", "lastName", "profileURL"]);
    const jsonData = allConnections.map((items) => {
      const connectionList =
        items.fromUser._id.toString() === _id.toString()
          ? items.toUser
          : items.fromUser;
      return connectionList;
    });
    res.json(jsonData);
  } catch (error) {
    res.status(400).send("ERROR: ", error.message);
  }
});

router.get("/feed", auth, async (req, res) => {
  try {
    const { _id } = req.userData;
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 15;
    const skipValue = (page - 1) * limit;
    const newLimit = limit > 50 || limit < 0 ? 50 : limit;

    const hideUserList = await Connection.find({
      $or: [{ fromUser: _id }, { toUser: _id }],
    }).select("fromUser toUser");

    const hideUsers = new Set();
    hideUserList.forEach((element) => {
      hideUsers.add(element.fromUser.toString());
      hideUsers.add(element.toUser.toString());
    });

    const feedUsers = await User.find({
      _id: { $nin: [...hideUsers, _id.toString()] },
    })
      .limit(newLimit)
      .skip(skipValue);

    res.send(feedUsers);
  } catch (error) {
    res.status(400).send("Something Went Wrong!");
  }
});

module.exports = router;
