"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const updateCandidateProfileSchema = joi_1.default.object({
    firstName: joi_1.default.string().min(2).max(50).trim().optional().allow('').pattern(/^[A-Za-z]+$/).messages({
        'string.min': 'First name must be at least 2 characters long !',
        'string.max': 'First name cannot exceed 50 characters !',
        'string.pattern.base': 'First name must contain only letters'
    }),
    lastName: joi_1.default.string().min(2).max(50).trim().optional().allow('').pattern(/^[A-Za-z]+$/).messages({
        'string.min': 'Last name must be at least 2 characters long !',
        'string.max': 'Last name cannot exceed 50 characters !',
        'string.pattern.base': 'Last name must contain only letters'
    }),
    mobileNumber: joi_1.default.string().pattern(/^[0-9]{10}$/).optional().allow('').messages({
        'string.pattern.base': 'Mobile number must be a valid 10-digit number !'
    }),
    address: joi_1.default.string().min(5).max(150).trim().optional().allow('').messages({
        'string.min': 'Address must be at least 5 characters long !',
        'string.max': 'Address cannot exceed 150 characters !'
    }),
    dateOfBirth: joi_1.default.date()
        .iso()
        .less("now")
        .optional()
        .allow('')
        .messages({
        'date.format': 'Date of birth must be a valid date !',
        'date.less': 'Date of birth cannot be a future date !'
    }),
    gender: joi_1.default.string()
        .valid("Male", "Female", "Other")
        .optional().allow('')
        .messages({
        'any.only': 'Gender must be either Male, Female, or Other !'
    }),
    category: joi_1.default.string()
        .valid("IT", "Non-IT")
        .optional().allow('')
        .messages({
        'any.only': 'Category must be either IT or Non-IT !'
    }),
    // File upload fields - handled by multer middleware, just allow them in validation
    profile: joi_1.default.any().optional().allow(''),
    profilepicture: joi_1.default.any().optional().allow('')
});
exports.default = updateCandidateProfileSchema;
