import Joi from 'joi';

const jobIdSchema = Joi.object({
    jobId: Joi.string()
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

export default jobIdSchema;
