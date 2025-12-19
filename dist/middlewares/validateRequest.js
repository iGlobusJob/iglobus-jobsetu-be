"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest = (schema, source = 'body') => {
    return (req, res, next) => {
        let dataToValidate;
        if (source === 'params') {
            dataToValidate = req.params;
        }
        else if (source === 'query') {
            dataToValidate = req.query;
        }
        else {
            dataToValidate = req.body;
        }
        const { error } = schema.validate(dataToValidate, { abortEarly: false });
        if (error) {
            const missingFields = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                missingFields: missingFields
            });
        }
        next();
    };
};
exports.default = validateRequest;
