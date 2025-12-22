"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const updateClientByAdminSchema = joi_1.default.object({
    clientId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
        'string.pattern.base': 'Invalid client ID format. Must be a valid MongoDB ObjectId',
        'any.required': 'Client ID is required'
    }),
    primaryContact: joi_1.default.object({
        firstName: joi_1.default.string().pattern(/^[A-Za-z]+$/).min(2).trim().messages({
            'string.min': 'First name must be at least 2 characters long',
            'string.pattern.base': 'Firstname must contain only letters'
        }),
        lastName: joi_1.default.string().pattern(/^[A-Za-z]+$/).min(2).trim().messages({
            'string.pattern.base': 'Lastname must contain only letters',
            'string.min': 'Last name must be at least 2 characters long'
        })
    }).required(),
    organizationName: joi_1.default.string().min(2).max(100).trim().required().messages({
        'string.min': 'Organization name must be at least 2 characters long',
        'string.max': 'Organization name must not exceed 100 characters'
    }),
    password: joi_1.default.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .optional()
        .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
    secondaryContact: joi_1.default.object({
        firstName: joi_1.default.string().trim().optional().allow('').pattern(/^[A-Za-z]+$/).messages({
            'string.pattern.base': 'Firstname must contain only letters'
        }),
        lastName: joi_1.default.string().trim().optional().allow('').pattern(/^[A-Za-z]+$/).messages({
            'string.pattern.base': 'Lastname must contain only letters'
        })
    }).optional(),
    status: joi_1.default.string().valid('registered', 'active', 'inactive').required().messages({
        'any.only': 'Status must be either "registered", "active", or "inactive"'
    }),
    emailStatus: joi_1.default.string().valid('verified', 'notverified').optional().messages({
        'any.only': 'Email status must be either "verified" or "notverified"'
    }),
    mobile: joi_1.default.string().pattern(/^\d{10}$/).optional().messages({
        'string.pattern.base': 'Mobile number must be exactly 10 digits'
    }),
    mobileStatus: joi_1.default.string().valid('verified', 'notverified').optional().messages({
        'any.only': 'Mobile status must be either "verified" or "notverified"'
    }),
    location: joi_1.default.string().trim().allow('', null).optional(),
    gstin: joi_1.default.string()
        .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
        .uppercase()
        .required()
        .messages({
        'string.pattern.base': 'GSTIN must be in valid format (e.g., 22AAAAA0000A1Z5)'
    }),
    panCard: joi_1.default.string()
        .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
        .uppercase()
        .required()
        .messages({
        'string.pattern.base': 'PAN Card must be in valid format (e.g., ABCDE1234F)'
    }),
    category: joi_1.default.string().optional(),
    logo: joi_1.default.string().trim().allow('').optional().messages({
        'string.base': 'Logo must be a valid string URL'
    })
}).min(2).messages({
    'object.min': 'At least one field must be provided for update along with clientId'
});
exports.default = updateClientByAdminSchema;
