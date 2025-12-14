import Joi from 'joi';

const validateOTPSchema = Joi.object({
    email: Joi.string()
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
    otp: Joi.string()
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

export default validateOTPSchema;
