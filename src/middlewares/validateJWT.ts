import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY!;

const validateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'] || req.headers['auth_token'];
    const authToken: any = authHeader && typeof authHeader === 'string'
        ? (authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader)
        : null;
    if (authToken) {
        jwt.verify(authToken, SECRET_KEY, (error: any, decoded: any) => {
            if (error) {
                return res.status(403).json({ message: "Invalid token !" });
            }
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({ message: "No token provided !" });
    }
}

export default validateJWT;
