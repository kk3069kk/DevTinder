import { Server } from "socket.io";
import crypto from "crypto";

const getHash = (chatId,userId)=>{
  return crypto.createHash("sha256")
  .update([chatId,userId].sort().join("_"))
  .digest("hex")
}

const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
       socket.on("joinChat",({firstName,chatId,userId})=>{

        const roomId = getHash(chatId,userId);
        console.log(firstName +roomId);
        socket.join(roomId);
        
       })
       socket.on("sendMessage",({firstName,chatId,userId,text})=>{
            const roomId = getHash(chatId,userId);
            console.log(firstName +"->"+text);
            io.to(roomId).emit("messageRecieved", {firstName,text} );
       })
       socket.on("disconnect",()=>{
       })
    })
}

export default initializeSocket;