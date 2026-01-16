import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const userauth = async (req,res,next)=>{
   
    try {

    const {token} = req.cookies;
    if(!token) throw new Error("Please login");

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const {_id} = decoded;

    const user  = await User.findById(_id).select("+password");
    if(!user) throw new Error("user not found");

    req.user = user;
    next();

    } catch (error) {
        res.send("Error:" + error.message);
    } 
}