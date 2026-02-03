import express from "express";
import mongodb from "./config/database.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./Routes/auth.js";
import profileRouter from "./Routes/profile.js";
import requestRouter from "./Routes/request.js";
import userRouter from "./Routes/user.js";
import http from "http";
import initializeSocket from "./utils/socket.js";




const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());

const server = http.createServer(app);
initializeSocket(server);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

mongodb()
    .then(() => {
        console.log("connected");
        server.listen(process.env.PORT, () => {
            console.log(`app is listening on port ${process.env.PORT}`);
        })

    })
    .catch((err) => console.log(err));




