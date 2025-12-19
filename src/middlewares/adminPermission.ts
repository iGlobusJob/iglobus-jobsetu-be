import { Request, Response, NextFunction } from 'express';

const adminPermission = (req: Request, res: Response, next: NextFunction) => {
    const adminId = req.user?.adminId;
    const role = req.user?.role;

    if (!adminId || !role) {
        return res.status(401).json({
            success: false,
            message: 'Invalid admin credentials. Access denied !'
        });
    }

    // Optionally check for specific roles
    if (role !== 'admin' && role !== 'superadmin') {
        return res.status(403).json({
            success: false,
            message: 'Insufficient permissions. Admin access required !'
        });
    }

    next();
};

export default adminPermission;
