import express from "express";
import mongodb from "./config/database.js";
import User from "./models/user.model.js";
import { validation } from "./utils/validation.js";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userauth } from "./Middleware/auth.js";
import dotenv from "dotenv";


dotenv.config({
    path:'./env'
})

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup" , async (req,res)=>{
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

app.post("/login", async (req,res)=>{
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

app.get("/profile" ,userauth, async(req,res)=>{
   try {
    
    const user =  req.user;
    res.send(user);

   } catch (error) {
    res.send("error:" + error.message);
   }
    
})

app.get("/user" , async (req,res)=>{
    const userEmail = req.body.emailId;

    try {

     const user =   await User.find({emailId:userEmail});

     if(user.length === 0) res.status(404).send("User not found");
     res.send(user);

    } catch (error) {
        res.status(401).send("something went wrong");
    }
})

app.get("/getalluser" , async (req,res)=>{

    try {
     const user =   await User.find({});
     res.status(200).send(user);

    } catch (error) {
        res.status(401).send("something went wrong");
    }
})

app.delete("/user" , async (req,res)=>{
    const userId = req.body.userId;

    try {
          const user = await User.findByIdAndDelete(userId);
          res.send("user deleted succesfully");
    } catch (error) {
        res.status(401).send("something went wrong");
    }
})

app.patch("/user/:userId" , async (req,res)=>{
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

mongodb()
.then(()=> {
    console.log("connected");
    app.listen(7777 , ()=>{
    console.log("app is litening");
})

})
.catch((err)=>console.log(err));




