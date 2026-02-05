import { Server } from "socket.io";
import crypto from "crypto";
import Chat from "../models/chat.model.js";


const getHash = (chatId,userId)=>{
  return crypto.createHash("sha256")
  .update([chatId,userId].sort().join("_"))
  .digest("hex")
}

const initializeSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
       socket.on("joinChat",({firstName,chatId,userId})=>{

        const roomId = getHash(chatId,userId);
        console.log(firstName +roomId);
        socket.join(roomId);
        
       })
       socket.on("sendMessage",async ({firstName,chatId,userId,text})=>{
           try {
            const roomId = getHash(chatId,userId);
            

            let chat = await Chat.findOne({
                participants: {$all: [chatId,userId]}
            });
            if(!chat){
                chat = new Chat({
                    participants:[chatId,userId],
                    messages:[]
                });
            }
            const newMessage = {
                senderId: userId,
                text,
            }
            chat.messages.push(newMessage);
            await chat.save();
            
            io.to(roomId).emit("messageRecieved", {firstName,text} );
           } catch (error) {
            console.error("socket error"+ error.message);
           } 
        
       })
       socket.on("disconnect",()=>{
       })
    })
}

export default initializeSocket;