import Joi from 'joi';

const vendorSchema = Joi.object({
    primaryContact: Joi.object({
        firstName: Joi.string().min(2).max(50).trim().required().messages({
            'string.empty': 'Primary contact first name is required',
            'string.min': 'First name must be at least 2 characters',
            'any.required': 'Primary contact first name is required'
        }),
        lastName: Joi.string().min(2).max(50).trim().required().messages({
            'string.empty': 'Primary contact last name is required',
            'string.min': 'Last name must be at least 2 characters',
            'any.required': 'Primary contact last name is required'
        })
    }).required().messages({
        'any.required': 'Primary contact is required'
    }),
    organizationName: Joi.string().min(2).max(100).trim().required().messages({
        'string.empty': 'Organization name is required',
        'any.required': 'Organization name is required'
    }),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character like @$!%*?&',
        'any.required': 'Password is required'
    }),
    email: Joi.string().email().lowercase().trim().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),
    secondaryContact: Joi.object({
        firstName: Joi.string().min(2).max(50).trim().optional(),
        lastName: Joi.string().min(2).max(50).trim().optional()
    }).optional(),
    status: Joi.string().valid('registered', 'active').optional(),
    emailStatus: Joi.string().valid('verified', 'notverified').optional(),
    mobile: Joi.string().pattern(/^\d{10}$/).optional().messages({
        'string.pattern.base': 'Mobile number must be 10 digits'
    }),
    mobileStatus: Joi.string().valid('verified', 'notverified').optional(),
    location: Joi.string().trim().optional(),
    gstin: Joi.string().pattern(/^[A-Z0-9]+$/).min(15).max(15).uppercase().required().messages({
        'string.pattern.base': 'GSTIN must contain only uppercase letters and numbers',
        'string.min': 'GSTIN must be exactly 15 characters',
        'string.max': 'GSTIN must be exactly 15 characters',
        'string.empty': 'GSTIN is required',
        'any.required': 'GSTIN is required',
    }),
    panCard: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).uppercase().required().messages({
        'string.pattern.base': 'Invalid PAN card format',
        'string.empty': 'PAN Card is required',
        'any.required': 'PAN Card is required',
    }),
    category: Joi.string().valid('IT', 'Non-IT').required().messages({
        'string.empty': 'Category is required',
        'any.only': 'Category must be either IT or Non-IT',
        'any.required': 'Category is required'
    })
});

export default vendorSchema;
