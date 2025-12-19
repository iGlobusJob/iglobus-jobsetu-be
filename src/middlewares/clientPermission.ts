import { Request, Response, NextFunction } from 'express';

const clientPermission = (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.user?.clientId;

    if (!clientId) {
        return res.status(401).json({
            success: false,
            message: 'Invalid client ID. Access denied !'
        });
    }

    next();
};

export default clientPermission;
