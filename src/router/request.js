const Connection = require("../configs/connectionSchema");
const User = require("../configs/databaseSchema");
const auth = require("../middlewares/auth");
const express = require("express");
const { run } = require("../utils/emailService");

const router = express.Router();
router.post("/request/:status/:toUser", auth, async (req, res) => {
  try {
    const { toUser, status } = req.params;
    const fromUser = req.userData._id;

    const allowedStatusType = ["ignored", "interested"];

    if (!allowedStatusType.includes(status)) {
      return res.status(400).json({ error: "Invalid status type" });
    }

    const toUserDetails = await User.findById(toUser);
    if (!toUserDetails) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const existingReq = await Connection.findOne({
      $or: [
        { fromUser, toUser },
        { fromUser: toUser, toUser: fromUser },
      ],
    });

    if (existingReq) {
      return res.status(400).json({ error: "Request already sent!" });
    }

    const document = new Connection({ fromUser, toUser, status });
    await document.save();
    
    return res.json({ message: `${status} request sent successfully` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/request/review/:status/:fromUser", auth, async (req, res) => {
  try {
    const { _id } = req.userData;
    const { status, fromUser } = req.params;

    const validStatus = ["accepted", "rejected"];
    if (!validStatus.includes(status)) {
      throw new Error("INVALID STATUS REQUEST");
    }
    const updatedConnection = await Connection.findOneAndUpdate(
      {
        toUser: _id,
        fromUser: fromUser,
        status: "interested",
      },
      { $set: { status: "accepted" } },
      { new: true }
    );

    if (!updatedConnection) {
      throw new Error("Invalid Request");
    }
    res.send("Request Send");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
