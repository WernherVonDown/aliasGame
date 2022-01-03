import jwt from 'jsonwebtoken';
import config from 'config'
const secret = config.get<string>('jwtSectret');

export const generateAccessToken = (payload: any, options: jwt.SignOptions): string => {
    return jwt.sign(payload, secret, options)
}