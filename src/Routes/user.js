import express from "express";
import { userauth } from "../Middleware/auth.js";
import ConnectionRequest from "../models/connectionRequest.model.js";
const userRouter = express.Router();

userRouter.get("/user/request/received",userauth,async(req,res)=>{
   
    try {
    const user = req.user;

     const getRequest = await ConnectionRequest.find({
        toUserId : user._id,
        status:"interested"
     }).populate("fromUserId",
        "firstName lastName gender age skills about"
       )

     res.json({
        message: "request fetching successfully",
        getRequest
     })
    } catch (error) {
        res.status(400).send("Error:"+error.message);
    }

})

userRouter.get("/user/connection",userauth,async(req,res)=>{
    try {
        const user = req.user;
        
        const connectedUser = await ConnectionRequest.find({
            $or:[
                {fromUserId:user._id,status:"accepted"},
                {toUserId:user._id,status:"accepted"}
            ]
        }).populate("fromUserId",
        "firstName lastName gender age skills about"
        ).populate("toUserId",
        "firstName lastName gender age skills about"
        )
         
        const data = connectedUser.map((row)=>{
            if(row.fromUserId._id.toString()===user._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({
            message:"connection Fetched Successfully",
            data
        })

    } catch (error) {
        res.status(500).send("Error:"+error.message);
    }
})

export default userRouter;