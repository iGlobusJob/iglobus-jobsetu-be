"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const updateJobSchema = joi_1.default.object({
    jobId: joi_1.default.string().required().messages({
        'any.required': 'Job ID is required',
        'string.empty': 'Job ID cannot be empty'
    }),
    jobTitle: joi_1.default.string().trim().optional(),
    jobDescription: joi_1.default.string().trim().min(50).optional().messages({
        'string.min': 'Job description must be at least 50 characters'
    }),
    postStart: joi_1.default.date().optional().messages({
        'date.base': 'Post start must be a valid date'
    }),
    postEnd: joi_1.default.date().optional().greater(joi_1.default.ref('postStart')).messages({
        'date.base': 'Post end must be a valid date',
        'date.greater': 'Post end date must be after post start date'
    }),
    noOfPositions: joi_1.default.number().integer().min(1).optional().messages({
        'number.base': 'Number of positions must be a number',
        'number.min': 'Number of positions must be at least 1'
    }),
    minimumSalary: joi_1.default.number().min(0).optional().messages({
        'number.base': 'Minimum salary must be a number',
        'number.min': 'Minimum salary cannot be negative'
    }),
    maximumSalary: joi_1.default.number().min(0).optional().greater(joi_1.default.ref('minimumSalary')).messages({
        'number.base': 'Maximum salary must be a number',
        'number.min': 'Maximum salary cannot be negative',
        'number.greater': 'Maximum salary must be greater than minimum salary'
    }),
    jobType: joi_1.default.string().valid('full-time', 'part-time', 'internship', 'freelance', 'contract').optional().messages({
        'any.only': 'Job type must be either full-time, part-time, internship, freelance, or contract'
    }),
    jobLocation: joi_1.default.string().trim().optional().allow(''),
    minimumExperience: joi_1.default.number().min(0).optional().messages({
        'number.base': 'Minimum experience must be a number',
        'number.min': 'Minimum experience cannot be negative'
    }),
    maximumExperience: joi_1.default.number().min(0).optional().when('minimumExperience', {
        is: joi_1.default.exist(),
        then: joi_1.default.number().min(joi_1.default.ref('minimumExperience')),
        otherwise: joi_1.default.number()
    }).messages({
        'number.base': 'Maximum experience must be a number',
        'number.min': 'Maximum experience must be greater than or equal to minimum experience'
    }),
    status: joi_1.default.string().valid('active', 'closed', 'drafted').optional().messages({
        'any.only': 'Status must be either active, closed, or drafted'
    })
});
exports.default = updateJobSchema;
