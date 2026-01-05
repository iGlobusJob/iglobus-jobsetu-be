import { Request, Response, NextFunction } from 'express';

const parseFormData = (req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
        if (req.body.primaryContact && typeof req.body.primaryContact === 'string') {
            try {
                req.body.primaryContact = JSON.parse(req.body.primaryContact);
            } catch (error) {
                console.error(`Failed to parse primaryContact: ${error}`);
            }
        }

        if (req.body.secondaryContact && typeof req.body.secondaryContact === 'string') {
            try {
                req.body.secondaryContact = JSON.parse(req.body.secondaryContact);
            } catch (error) {
                console.error(`Failed to parse secondaryContact: ${error}`);
            }
        }
    }

    next();
};

export default parseFormData;
