"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const clientSchema = joi_1.default.object({
    primaryContact: joi_1.default.object({
        firstName: joi_1.default.string().min(2).max(50).trim().required().messages({
            'string.empty': 'Primary contact first name is required',
            'string.min': 'First name must be at least 2 characters',
            'any.required': 'Primary contact first name is required'
        }),
        lastName: joi_1.default.string().min(2).max(50).trim().required().messages({
            'string.empty': 'Primary contact last name is required',
            'string.min': 'Last name must be at least 2 characters',
            'any.required': 'Primary contact last name is required'
        })
    }).required().messages({
        'any.required': 'Primary contact is required'
    }),
    organizationName: joi_1.default.string().min(2).max(100).trim().required().messages({
        'string.empty': 'Organization name is required',
        'any.required': 'Organization name is required'
    }),
    password: joi_1.default.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character like @$!%*?&',
        'any.required': 'Password is required'
    }),
    email: joi_1.default.string().email().lowercase().trim().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),
    secondaryContact: joi_1.default.object({
        firstName: joi_1.default.string().min(2).max(50).trim().optional(),
        lastName: joi_1.default.string().min(2).max(50).trim().optional()
    }).optional(),
    status: joi_1.default.string().valid('registered', 'active').optional(),
    emailStatus: joi_1.default.string().valid('verified', 'notverified').optional(),
    mobile: joi_1.default.string().pattern(/^\d{10}$/).optional().messages({
        'string.pattern.base': 'Mobile number must be 10 digits'
    }),
    mobileStatus: joi_1.default.string().valid('verified', 'notverified').optional(),
    location: joi_1.default.string().trim().optional(),
    gstin: joi_1.default.string().pattern(/^[A-Z0-9]+$/).min(15).max(15).uppercase().required().messages({
        'string.pattern.base': 'GSTIN must contain only uppercase letters and numbers',
        'string.min': 'GSTIN must be exactly 15 characters',
        'string.max': 'GSTIN must be exactly 15 characters',
        'string.empty': 'GSTIN is required',
        'any.required': 'GSTIN is required',
    }),
    panCard: joi_1.default.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).uppercase().required().messages({
        'string.pattern.base': 'Invalid PAN card format',
        'string.empty': 'PAN Card is required',
        'any.required': 'PAN Card is required',
    }),
    category: joi_1.default.string().valid('IT', 'Non-IT').required().messages({
        'string.empty': 'Category is required',
        'any.only': 'Category must be either IT or Non-IT',
        'any.required': 'Category is required'
    })
});
exports.default = clientSchema;
