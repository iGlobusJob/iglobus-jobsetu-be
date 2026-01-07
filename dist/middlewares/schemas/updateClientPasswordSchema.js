"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const updateClientPasswordSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .lowercase()
        .trim()
        .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
    }),
    newPassword: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'string.empty': 'New password is required',
        'any.required': 'New password is required'
    }),
    reEnterNewPassword: joi_1.default.string()
        .valid(joi_1.default.ref('newPassword'))
        .required()
        .messages({
        'any.only': 'Passwords do not match',
        'string.empty': 'Please re-enter the new password',
        'any.required': 'Please re-enter the new password'
    })
});
exports.default = updateClientPasswordSchema;
