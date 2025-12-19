"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const candidatePermission = (req, res, next) => {
    var _a;
    const candidateId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.candidateId;
    if (!candidateId) {
        return res.status(401).json({
            success: false,
            message: 'Invalid candidate ID. Access denied !'
        });
    }
    next();
};
exports.default = candidatePermission;
