import express from "express";
import { validation } from "../utils/validation.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
const authRouter = express.Router();

authRouter.post("/signup" , async (req,res)=>{
    try {

    validation(req);
    
    const {firstName,lastName,emailId,password} = req.body;
    
    const hashPassword = await bcrypt.hash(password,10);
    const user = new User({
        firstName,
        lastName,
        emailId,
        password:hashPassword,

    });

        await user.save();
        res.send("Success");
    } catch (error) {
        res.status(401).send("ERROR" + error);
    }

})

authRouter.post("/login", async (req,res)=>{
    try {
        const {emailId , password} = req.body;
        
        if(!emailId|| !password) throw new Error("the given fields are required");

        const user = await User
        .findOne({emailId:emailId})
        .select("+password");

        if(!user) throw new Error("INvalid Credentials");
       
        const checkPassword = await user.isPasswordValid(password);

        if(checkPassword){

            const token =  await user.getJwt();
            
            res.cookie("token",token,{
                http:true,
                maxAge:new Date(Date.now() + 24*60*60*1000)
            });
            res.send("Login successfully");
        }
        else{
            throw new Error("Invalid Credential")
        }

    } catch (error) {
        res.status(401).send("Error:" + error.message);
    }
})

authRouter.post("/logout", async (req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    })
    res.send("logout Successfully");
})

export default authRouter;