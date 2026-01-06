import Joi from 'joi';

const validateForgetPasswordOTPSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .lowercase()
        .trim()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        }),
    otp: Joi.string()
        .length(5)
        .pattern(/^\d{5}$/)
        .required()
        .messages({
            'string.length': 'OTP must be exactly 5 digits',
            'string.pattern.base': 'OTP must be exactly 5 digits',
            'string.empty': 'OTP is required',
            'any.required': 'OTP is required'
        })
});

export default validateForgetPasswordOTPSchema;
