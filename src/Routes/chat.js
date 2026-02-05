import express from "express";
import { userauth } from "../Middleware/auth.js";
import Chat from "../models/chat.model.js";  



const chatRouter = express.Router();

chatRouter.get("/chat/:chatId",userauth, async (req, res) => {
    try {
        const userId = req.user._id;
        const {chatId}  = req.params;

        let chat = await Chat.findOne({
            participants: {$all: [chatId,userId]}
        }).populate({
             path: 'messages.senderId',
             select: 'firstName lastName'
        });
        if (!chat) {
            chat = new Chat({
                participants: [chatId, userId],
                messages: []
            });
            await chat.save();
        }
        res.json(chat)

    } catch (error) {
        res.status(500).send("Error: " + error.message);
     }
});           


export default chatRouter;