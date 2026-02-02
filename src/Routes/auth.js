import express from "express";
import { validation } from "../utils/validation.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {

        validation(req);

        const { firstName, lastName, emailId, password } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashPassword,

        });

        const savedUser = await user.save();
        const token = await savedUser.getJwt();

            res.cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });
        res.json({message:"message send successfully",
                 data:savedUser,
            });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }

})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId || !password) throw new Error("the given fields are required");

        const user = await User
            .findOne({ emailId: emailId })
            .select("+password");

        if (!user) throw new Error("INvalid Credentials");

        const checkPassword = await user.isPasswordValid(password);

        if (checkPassword) {

            const token = await user.getJwt();

            res.cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });
            res.send(user);
        }
        else {
            throw new Error("Invalid Credential")
        }

    } catch (error) {
        res.status(401).send("Error:" + error.message);
    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("logout Successfully");
})

export default authRouter;