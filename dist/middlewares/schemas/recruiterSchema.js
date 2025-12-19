"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const recruiterSchema = joi_1.default.object({
    firstName: joi_1.default.string()
        .min(2)
        .max(50)
        .pattern(/^[A-Za-z]+$/)
        .required()
        .trim()
        .messages({
        'string.base': 'First name must be a string',
        'string.empty': 'First name is required',
        'string.min': 'First name must be at least 2 characters long',
        'string.max': 'First name must not exceed 50 characters',
        'string.pattern.base': 'First name must contain only letters',
        'any.required': 'First name is required'
    }),
    lastName: joi_1.default.string()
        .min(2)
        .max(50)
        .pattern(/^[A-Za-z]+$/)
        .required()
        .trim()
        .messages({
        'string.base': 'Last name must be a string',
        'string.empty': 'Last name is required',
        'string.min': 'Last name must be at least 2 characters long',
        'string.max': 'Last name must not exceed 50 characters',
        'string.pattern.base': 'Last name must contain only letters',
        'any.required': 'Last name is required'
    }),
    email: joi_1.default.string()
        .email()
        .required()
        .lowercase()
        .trim()
        .messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),
    password: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        'any.required': 'Password is required'
    })
});
exports.default = recruiterSchema;
