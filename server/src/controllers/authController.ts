import { Request, Response } from "express";
import User from "../models/User";
import log from "../utils/logger";
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { generateAccessToken } from '../utils/generateAccessToken';

class AuthController {
    async registration(req: Request, res: Response): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ message: "Registration failed", errors })
                return;
            }
            const { username, password, email } = req.body;
            console.log('EEEEEEEEEEE', { username, password, email })
            const userExists = await User.findOne({ email });
            if (userExists) {
                res.status(400).json({ message: 'This email is already used' })
                return;
            }
            const hashedpass = bcrypt.hashSync(password, 7);
            const user = new User({
                username,
                password: hashedpass,
                email,
                wordsLists: []
            });
            user.save();
            res.json({ success: true })
        } catch (error) {
            log.error(error);
            res.status(400).json({ message: 'registration error' })
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { password, email } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                res.status(400).json({ message: "User not found" })
                return;
            }

            const passValid = bcrypt.compareSync(password, user.password);
            if (!passValid) {
                res.status(400).json({ message: "Password is incorrect" });
                return;
            }

            const token = generateAccessToken({ username: user.username, id: user._id }, {expiresIn: "24h"})
            res.json(token);
        } catch (error) {
            log.error(error);
            res.status(400).json({ message: 'registration error' })
        }
    }
}

export default new AuthController()