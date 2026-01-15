import express from "express";
import mongodb from "./config/database.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./Routes/auth.js";
import profileRouter from "./Routes/profile.js";
import requestRouter from "./Routes/request.js";

dotenv.config({
    path:'./env'
})

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

mongodb()
.then(()=> {
    console.log("connected");
    app.listen(7777 , ()=>{
    console.log("app is litening");
})

})
.catch((err)=>console.log(err));




