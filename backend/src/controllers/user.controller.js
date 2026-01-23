import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";
import { User } from "../models/user.model.js";


const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "Please provide details" });
    }

    try {

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found!" });
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({
                token: token,
                user: {
                    name: user.name,
                    username: user.username,
                    email: user.email
                }
            });
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invaild Username or password" });
        }

    } catch (e) {
        return res.status(500).json({ Message: `Something went wrong ${e}` });
    }

}

const register = async (req, res) => {
    const { name, username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exist!" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            email: email,
            password: hashPassword
        })

        await newUser.save();
        res.status(httpStatus.CREATED).json({ message: "User Registered!" });


    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }

}

export { login, register }