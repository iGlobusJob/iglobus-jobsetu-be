"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const jobIdSchema = joi_1.default.object({
    jobId: joi_1.default.string()
        .required()
        .trim()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
        'string.base': 'Job ID must be a string',
        'string.empty': 'Job ID is required',
        'any.required': 'Job ID is required',
        'string.pattern.base': 'Invalid job ID format. Must be a valid MongoDB ObjectId',
    }),
});
exports.default = jobIdSchema;
