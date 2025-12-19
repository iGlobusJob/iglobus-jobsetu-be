"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const clientLoginSchema = joi_1.default.object({
    email: joi_1.default.string().email().lowercase().trim().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
    })
});
exports.default = clientLoginSchema;
