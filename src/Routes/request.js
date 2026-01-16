import express from "express";
const requestRouter = express.Router();
import {userauth} from "../Middleware/auth.js"
import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.model.js";

requestRouter.post("/request/send/:status/:userId",userauth,async(req,res)=>{
    try {
        const fromUserId= req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        const allowedStatus = ["ignored" , "interested"];

        if(!allowedStatus.includes(status)){
           return res.status(400).send("invalid status type" + status);
        }
        const toUser = await User.findById(toUserId);
        if(!toUser) throw new Error("invalid user");

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId , toUserId:fromUserId}
            ]
        })
        if(existingConnectionRequest){
            throw new Error("already existed");
        }

        const connection = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connection.save();

        res.json({
            message:"connection send succesfully",
            data
        })
    } catch (error) {
        res.send("Error:"+error.message);
    }
})

requestRouter.post("/request/review/:status/:requestId",userauth,async(req,res)=>{
    try {
        const user =req.user;
        const {status,requestId} = req.params;

        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            throw new Error("invalid status");
        }
        const connection = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:user._id,
            status:"interested"
        })
        if(!connection){
            throw new Error("no connection present");
        }

        connection.status = status;
        const data = await connection.save();

        res.json({
            message:"successfull",
            data
        })

    } catch (error) {
        res.status(400).send("Error:"+error.message);
    }
})
export default requestRouter;