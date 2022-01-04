import { Request, Response } from "express";
import User from "../models/User";
import log from "../utils/logger";
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { generateAccessToken } from '../utils/generateAccessToken';
import { decodeAccessToken } from '../utils/decodeAccessToken';

class AuthController {
    async registration(req: Request, res: Response): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.json({ success: false, message: "Registration failed", errors })
                return;
            }
            const { username, password, email } = req.body;
            console.log('EEEEEEEEEEE', { username, password, email })
            const userExists = await User.findOne({ email });
            if (userExists) {
                res.json({ success: false, message: 'This email is already used' })
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
            res.json({ success: false, message: 'registration error' })
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { password, email } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                res.json({ message: "User not found", success: false })
                return;
            }

            const passValid = bcrypt.compareSync(password, user.password);
            if (!passValid) {
                res.json({ success: false, message: "Password is incorrect" });
                return;
            }

            const token = generateAccessToken({ username: user.username, id: user._id }, {expiresIn: "24h"})
            res.json({token, username: user.username, success: true});
        } catch (error) {
            log.error(error);
            res.json({ success: false, message: 'registration error' })
        }
    }

    async validate(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.json({message: 'User not authorized'})
            }
            const decodedData = decodeAccessToken(token);
            console.log("DECODED DATA", decodedData)
            //@ts-ignore
            const {id, username } = decodedData
            if (id && username) {
                res.json({
                    success: true,
                    
                    username: username
                })
            }

        } catch (error) {
            res.json({
                success: false,
                message: "validation failed"
            })
            log.error(`validateion failed ${error}`)
        }
    }
}

export default new AuthController()