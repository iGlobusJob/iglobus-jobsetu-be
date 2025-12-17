import Joi from 'joi';

const updateVendorProfileSchema = Joi.object({
    primaryContact: Joi.object({
        firstName: Joi.string().pattern(/^[A-Za-z]+$/).min(2).trim().messages({
            'string.min': 'First name must be at least 2 characters long',
            'string.pattern.base': 'First name must contain only letters'
        }),
        lastName: Joi.string().pattern(/^[A-Za-z]+$/).min(2).trim().messages({
            'string.min': 'Last name must be at least 2 characters long',
            'string.pattern.base': 'Lastname must contain only letters'
        })
    }).optional(),
    organizationName: Joi.string().min(2).max(100).trim().optional().messages({
        'string.min': 'Organization name must be at least 2 characters long',
        'string.max': 'Organization name must not exceed 100 characters'
    }),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .optional()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }),
    secondaryContact: Joi.object({
        firstName: Joi.string().trim().optional().allow(''),
        lastName: Joi.string().trim().optional().allow('')
    }).optional(),
    mobile: Joi.string().pattern(/^\d{10}$/).optional().messages({
        'string.pattern.base': 'Mobile number must be exactly 10 digits'
    }),
    location: Joi.string().trim().allow('').optional(),
    gstin: Joi.string()
        .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
        .uppercase()
        .optional()
        .messages({
            'string.pattern.base': 'GSTIN must be in valid format (e.g., 22AAAAA0000A1Z5)'
        }),
    panCard: Joi.string()
        .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
        .uppercase()
        .optional()
        .messages({
            'string.pattern.base': 'PAN Card must be in valid format (e.g., ABCDE1234F)'
        }),
    category: Joi.string()
        .valid('IT', 'Non-IT')
        .optional()
        .messages({
            'any.only': 'Category must be either "IT" or "Non-IT"'
        })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

export default updateVendorProfileSchema;
