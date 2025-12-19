import Joi from 'joi';

const clientIdSchema = Joi.object({
    clientId: Joi.string()
        .required()
        .trim()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            'string.base': 'Client ID must be a string',
            'string.empty': 'Client ID is required',
            'any.required': 'Client ID is required',
            'string.pattern.base': 'Invalid client ID format. Must be a valid MongoDB ObjectId',
        }),
});

export default clientIdSchema;
