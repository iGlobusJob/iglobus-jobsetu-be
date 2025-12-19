"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const candidateJoinSchema = joi_1.default.object({
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
});
exports.default = candidateJoinSchema;
