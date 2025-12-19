"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3Client_1 = __importDefault(require("./s3Client"));
const awsS3Config_1 = require("../config/awsS3Config");
const clientsFolder = 'clients';
const uploadLogoToS3 = async (clientId, fileName, buffer, mimetype) => {
    return new Promise((resolve, reject) => {
        const s3Key = `${clientsFolder}/${clientId}/logos/${fileName}`;
        const params = {
            Bucket: awsS3Config_1.bucketName,
            Key: s3Key,
            Body: buffer,
            ContentType: mimetype
            // Note: ACL removed - bucket policy will handle public access
        };
        s3Client_1.default.upload(params, (error, data) => {
            if (error) {
                console.error('Error uploading logo to S3:', error);
                reject(error);
            }
            else {
                // Return the public URL
                const publicUrl = `https://${awsS3Config_1.bucketName}.s3.amazonaws.com/${s3Key}`;
                resolve({
                    success: true,
                    fileUrl: publicUrl
                });
            }
        });
    });
};
exports.default = { uploadLogoToS3 };
