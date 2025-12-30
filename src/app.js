import express from "express";

const app = express();

app.get("/kk" ,(req,res) =>{
    res.send("Hello world");
})

app.listen(7777 , ()=>{
    console.log("app is litening");
})