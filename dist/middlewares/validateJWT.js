"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY;
const validateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['auth_token'];
    const authToken = authHeader && typeof authHeader === 'string'
        ? (authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader)
        : null;
    if (authToken) {
        jsonwebtoken_1.default.verify(authToken, SECRET_KEY, (error, decoded) => {
            if (error) {
                return res.status(403).json({ message: 'Invalid token !' });
            }
            req.user = decoded;
            next();
        });
    }
    else {
        res.status(401).json({ message: 'No token provided !' });
    }
};
exports.default = validateJWT;
