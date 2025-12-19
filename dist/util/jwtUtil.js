"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY;
const generateToken = (payload) => {
    const options = {
        expiresIn: '24h'
    };
    return jsonwebtoken_1.default.sign(payload, SECRET_KEY, options);
};
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, SECRET_KEY);
    }
    catch (error) {
        return null;
    }
};
exports.default = { generateToken, verifyToken };
