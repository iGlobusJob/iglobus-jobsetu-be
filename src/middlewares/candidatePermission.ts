import { Request, Response, NextFunction } from 'express';

const candidatePermission = (req: Request, res: Response, next: NextFunction) => {
    const candidateId = req.user?.candidateId;

    if (!candidateId) {
        return res.status(401).json({
            success: false,
            message: 'Invalid candidate ID. Access denied !'
        });
    }

    next();
};

export default candidatePermission;
