import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const userauth = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization || req.headers.Authorization;
        let token;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else {
            throw new Error("Please login");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decoded;

        const user = await User.findById(_id).select("+password");
        if (!user) throw new Error("user not found");

        req.user = user;
        next();

        // const { token } = req.cookies;
        // if (!token) throw new Error("Please login");

        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const { _id } = decoded;

        // const user = await User.findById(_id).select("+password");
        // if (!user) throw new Error("user not found");

        // req.user = user;
        // next();

    } catch (error) {
        res.status(401).send("Error:" + error.message);
    }
}