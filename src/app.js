import express from "express";
import mongodb from "./config/database.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./Routes/auth.js";
import profileRouter from "./Routes/profile.js";
import requestRouter from "./Routes/request.js";
import userRouter from "./Routes/user.js";

dotenv.config({
    path:'./env'
})

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

mongodb()
.then(()=> {
    console.log("connected");
    app.listen(7777 , ()=>{
    console.log("app is litening");
})

})
.catch((err)=>console.log(err));




