import Joi from 'joi';

const userSchema = Joi.object({
    userId: Joi.string().min(3).max(30).optional(),
    firstName: Joi.string().min(3).max(30).optional(),
    lastName: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().required(),
    mobileNumber: Joi.number().integer().min(0).optional(),
    dateOfBirth: Joi.date().optional(),
    presentAddress: Joi.string().optional(),
    permanentAddress: Joi.string().optional()

});

export default userSchema;
