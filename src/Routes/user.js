import express from "express";
import { userauth } from "../Middleware/auth.js";
import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.model.js";
const userRouter = express.Router();

userRouter.get("/user/request/received", userauth, async (req, res) => {

  try {
    const user = req.user;

    const getRequest = await ConnectionRequest.find({
      toUserId: user._id,
      status: "interested"
    }).populate("fromUserId",
      "firstName lastName gender age skills about"
    )

    res.json({
      message: "request fetching successfully",
      getRequest
    })
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }

})


userRouter.get("/user/connection", userauth, async (req, res) => {
  try {
    const user = req.user;

    const connectedUser = await ConnectionRequest.find({
      $or: [
        { fromUserId: user._id, status: "accepted" },
        { toUserId: user._id, status: "accepted" }
      ]
    }).populate("fromUserId",
      "firstName lastName gender age skills about"
    ).populate("toUserId",
      "firstName lastName gender age skills about"
    )

    const data = connectedUser.map((row) => {
      if (row.fromUserId._id.toString() === user._id.toString()) {
        return row.toUserId
      }
      return row.fromUserId
    })
    res.json({
      message: "connection Fetched Successfully",
      data
    })

  } catch (error) {
    res.status(500).send("Error:" + error.message);
  }
})

const USER_SAFE_DATA = "firstName lastName photoURL age gender about skills";

userRouter.get("/user/feed", userauth, async (req, res) => {
  try {
    const user = req.user;

    const page = parseInt(req.query.page || 1);
    let limit = parseInt(req.query.limit || 10);
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((row) => {
      hideUsersFromFeed.add(row.fromUserId.toString());
      hideUsersFromFeed.add(row.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: user._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});
export default userRouter;