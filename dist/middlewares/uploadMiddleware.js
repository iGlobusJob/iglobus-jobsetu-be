"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Configure multer to use memory storage (file will be in req.file.buffer)
const storage = multer_1.default.memoryStorage();
// File filter to accept only specific document formats
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'));
    }
};
// Configure multer with file size limit (10MB)
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});
exports.default = upload;
