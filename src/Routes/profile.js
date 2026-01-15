import express from "express";
import { userauth } from "../Middleware/auth.js";
import User from "../models/user.model.js";
const profileRouter = express.Router();

profileRouter.get("/profile" ,userauth, async(req,res)=>{
   try {
    
    const user =  req.user;
    res.send(user);

   } catch (error) {
    res.send("error:" + error.message);
   }
    
})

profileRouter.patch("/user/:userId" , async (req,res)=>{
    const userID = req.params?.userId;
    const data = req.body;

    try {
    const allowedToUpdate = [
        "gender",
        "age",
    ]
    const isUpdateAllowed = Object.keys(data).every((k)=>
      allowedToUpdate.includes(k)
    )
    if(!isUpdateAllowed){
        throw new Error("update not allowd");
    }
        await User.findByIdAndUpdate({_id:userID},data,{new:true, runValidators:true});
        res.send("updated successfully");
    } catch (error) {
        res.status(401).send("something went wrong"+ error.message);
    }
})

export default profileRouter;