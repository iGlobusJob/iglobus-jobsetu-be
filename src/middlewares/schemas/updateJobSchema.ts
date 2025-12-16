import Joi from 'joi';

const updateJobSchema = Joi.object({
    jobId: Joi.string().required().messages({
        'any.required': 'Job ID is required',
        'string.empty': 'Job ID cannot be empty'
    }),
    jobTitle: Joi.string().trim().optional(),
    jobDescription: Joi.string().trim().min(50).optional().messages({
        'string.min': 'Job description must be at least 50 characters'
    }),
    postStart: Joi.date().optional().messages({
        'date.base': 'Post start must be a valid date'
    }),
    postEnd: Joi.date().optional().greater(Joi.ref('postStart')).messages({
        'date.base': 'Post end must be a valid date',
        'date.greater': 'Post end date must be after post start date'
    }),
    noOfPositions: Joi.number().integer().min(1).optional().messages({
        'number.base': 'Number of positions must be a number',
        'number.min': 'Number of positions must be at least 1'
    }),
    minimumSalary: Joi.number().min(0).optional().messages({
        'number.base': 'Minimum salary must be a number',
        'number.min': 'Minimum salary cannot be negative'
    }),
    maximumSalary: Joi.number().min(0).optional().greater(Joi.ref('minimumSalary')).messages({
        'number.base': 'Maximum salary must be a number',
        'number.min': 'Maximum salary cannot be negative',
        'number.greater': 'Maximum salary must be greater than minimum salary'
    }),
    jobType: Joi.string().valid('full-time', 'part-time', 'internship', 'freelance', 'contract').optional().messages({
        'any.only': 'Job type must be either full-time, part-time, internship, freelance, or contract'
    }),
    jobLocation: Joi.string().trim().optional().allow(''),
    minimumExperience: Joi.number().min(0).optional().messages({
        'number.base': 'Minimum experience must be a number',
        'number.min': 'Minimum experience cannot be negative'
    }),
    maximumExperience: Joi.number().min(0).optional().when('minimumExperience', {
        is: Joi.exist(),
        then: Joi.number().min(Joi.ref('minimumExperience')),
        otherwise: Joi.number()
    }).messages({
        'number.base': 'Maximum experience must be a number',
        'number.min': 'Maximum experience must be greater than or equal to minimum experience'
    }),
    status: Joi.string().valid('active', 'closed', 'drafted').optional().messages({
        'any.only': 'Status must be either active, closed, or drafted'
    })
});

export default updateJobSchema;
