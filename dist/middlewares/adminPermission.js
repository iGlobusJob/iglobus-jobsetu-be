"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adminPermission = (req, res, next) => {
    var _a, _b;
    const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.adminId;
    const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
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
exports.default = adminPermission;
