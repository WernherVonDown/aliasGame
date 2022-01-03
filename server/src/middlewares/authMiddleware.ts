import { NextFunction, Request, Response } from "express";
import { decodeAccessToken } from "../utils/decodeAccessToken";
import log from "../utils/logger";

export default function (req: Request, res:Response, next:NextFunction) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(403).json({message: 'User not authorized'})
        }
        const decodedData = decodeAccessToken(token);
        console.log("DECODED DATA", decodedData)
        //@ts-ignore
        req.user = decodedData;

        next()

    } catch (error) {
        log.error(error)
    }
}