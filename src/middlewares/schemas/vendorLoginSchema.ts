import Joi from 'joi';

const vendorLoginSchema = Joi.object({
    email: Joi.string().email().lowercase().trim().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
    })
});

export default vendorLoginSchema;
