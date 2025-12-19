"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validateOTPSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .trim()
        .lowercase()
        .messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    otp: joi_1.default.string()
        .required()
        .trim()
        .length(5)
        .pattern(/^\d{5}$/)
        .messages({
        'string.base': 'OTP must be a string',
        'string.empty': 'OTP is required',
        'any.required': 'OTP is required',
        'string.length': 'OTP must be exactly 5 digits',
        'string.pattern.base': 'OTP must contain only numbers',
    }),
});
exports.default = validateOTPSchema;
