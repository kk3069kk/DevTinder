import { Server } from "socket.io";

const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
       socket.on("joinChat",(data)=>{
       })
       socket.on("sendMessage",(data)=>{
       })
       socket.on("disconnect",()=>{
       })
    })
}

export default initializeSocket;