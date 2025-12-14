import Joi from 'joi';

const vendorIdSchema = Joi.object({
    vendorId: Joi.string()
        .required()
        .trim()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.base': 'Vendor ID must be a string',
            'string.empty': 'Vendor ID is required',
            'any.required': 'Vendor ID is required',
            'string.pattern.base': 'Invalid vendor ID format. Must be a valid MongoDB ObjectId',
        }),
});

export default vendorIdSchema;
