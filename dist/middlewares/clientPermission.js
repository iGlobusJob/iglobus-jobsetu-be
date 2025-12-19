"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientPermission = (req, res, next) => {
    var _a;
    const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.clientId;
    if (!clientId) {
        return res.status(401).json({
            success: false,
            message: 'Invalid client ID. Access denied !'
        });
    }
    next();
};
exports.default = clientPermission;
