import { Request, Response, NextFunction } from 'express';

const vendorPermission = (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.user?.vendorId;

    if (!vendorId) {
        return res.status(401).json({
            success: false,
            message: 'Invalid vendor ID. Access denied !'
        });
    }

    next();
};

export default vendorPermission;
