import multer from 'multer';
import { Request } from 'express';

// Configure multer to use memory storage (file will be in req.file.buffer)
const storage = multer.memoryStorage();

// File filter to accept both resume files and profile pictures
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Skip validation if no file is actually uploaded (empty file)
    if (!file || !file.originalname || file.size === 0) {
        return cb(null, false);
    }

    // Allowed document types for resume
    const allowedDocumentMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    // Allowed image types for profile picture
    const allowedImageMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ];

    if (file.fieldname === 'profile') {
        // For resume field, accept documents
        if (allowedDocumentMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type for resume. Only PDF, DOC, and DOCX files are allowed.'));
        }
    } else if (file.fieldname === 'profilepicture') {
        // For profile picture field, accept images
        if (allowedImageMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type for profile picture. Only JPEG, JPG, PNG, GIF, and WEBP images are allowed.'));
        }
    } else {
        cb(new Error('Unexpected field name for file upload.'));
    }
};

// Configure multer with file size limit (10MB)
const uploadFields = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});

export default uploadFields;
