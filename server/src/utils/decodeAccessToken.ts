import jwt from 'jsonwebtoken';
import config from 'config'
const secret = config.get<string>('jwtSectret');

export const decodeAccessToken = (token: string): string | jwt.JwtPayload | {id: string, username: string} => {
    return jwt.verify(token, secret)
}