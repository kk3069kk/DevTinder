import express from "express";
import { userauth } from "../Middleware/auth.js";
import User from "../models/user.model.js";
import { validateProfileEdit } from "../utils/validation.js";
const profileRouter = express.Router();
import bcrypt from "bcrypt";
import validator from "validator";

profileRouter.get("/profile/views" ,userauth, async(req,res)=>{
   try {
    
    const user =  req.user;
    res.send(user);

   } catch (error) {
    res.send("error:" + error.message);
   }
    
})

profileRouter.patch("/profile/edit",userauth, async(req,res)=>{ 
try {
     if(!validateProfileEdit(req)){
        throw new Error("some data is not changable");
    }
    const user = req.user;

    Object.keys(req.body).forEach((keys)=>(user[keys] = req.body[keys]) )
    await user.save();

    res.send("your profile is updated successfully");
} catch (error) {
    res.send("Error:"+error.message);
}

})

// profileRouter.patch("/user/:userId" , async (req,res)=>{
//     const userID = req.params?.userId;
//     const data = req.body;

//     try {
//     const allowedToUpdate = [
//         "gender",
//         "age",
//     ]
//     const isUpdateAllowed = Object.keys(data).every((k)=>
//       allowedToUpdate.includes(k)
//     )
//     if(!isUpdateAllowed){
//         throw new Error("update not allowd");
//     }
//         await User.findByIdAndUpdate({_id:userID},data,{new:true, runValidators:true});
//         res.send("updated successfully");
//     } catch (error) {
//         res.status(401).send("something went wrong"+ error.message);
//     }
// })

profileRouter.patch("/changepassword",userauth,async(req,res)=>{
   try {
    const {oldPassword , newPassword} =req.body;
    const user = req.user;
    if (!oldPassword || !newPassword) {
      return res.status(400).send("Both passwords are required");
    }

    const validation = await user.isPasswordValid(oldPassword);
    if(validation){
    if(!validator.isStrongPassword(newPassword)) throw new Error("give correct password");
       const hashPassword = await bcrypt.hash(newPassword,10);
       user.password = hashPassword;
       await user.save();
       res.send("password changed Successfully");
    }
    else{
        throw new Error("password is incorrect");
    }
   } catch (error) {
     res.send("Error:" + error.message);
   }
})

export default profileRouter;