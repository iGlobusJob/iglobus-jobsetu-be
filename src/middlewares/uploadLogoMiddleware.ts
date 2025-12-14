import multer from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/svg+xml',
        'image/tiff'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only image files (JPEG, JPG, PNG, GIF, WEBP, BMP, SVG, TIFF) are allowed.'));
    }
};

const uploadLogo = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

export default uploadLogo;
