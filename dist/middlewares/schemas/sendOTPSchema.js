"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const sendOTPSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .lowercase()
        .trim()
        .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    })
});
exports.default = sendOTPSchema;
