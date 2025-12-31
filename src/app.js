import express from "express";
import mongodb from "./config/database.js";
import dotenv from "dotenv";

dotenv.config({
    path:'./env'
})

const app = express();

mongodb()
.then(()=> {
    console.log("connected");
    app.listen(7777 , ()=>{
    console.log("app is litening");
})

})
.catch((err)=>console.log(err));




