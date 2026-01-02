import express from "express";
import mongodb from "./config/database.js";
import User from "./models/user.model.js";
import dotenv from "dotenv";

dotenv.config({
    path:'./env'
})

const app = express();
app.use(express.json());

app.post("/signup" , async (req,res)=>{
    
    const user = new User(req.body);
    try {
        await user.save();
        res.send("Success");
    } catch (error) {
        res.status(401).send("ERROR" + error);
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

mongodb()
.then(()=> {
    console.log("connected");
    app.listen(7777 , ()=>{
    console.log("app is litening");
})

})
.catch((err)=>console.log(err));




