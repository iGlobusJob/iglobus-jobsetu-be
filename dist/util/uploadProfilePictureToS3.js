"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3Client_1 = __importDefault(require("./s3Client"));
const awsS3Config_1 = require("../config/awsS3Config");
const uploadProfilePictureToS3 = async (candidateId, fileName, buffer, mimetype) => {
    return new Promise((resolve, reject) => {
        const s3Key = `${awsS3Config_1.candidateFolder}/${candidateId}/profilepictures/${fileName}`;
        const params = {
            Bucket: awsS3Config_1.bucketName,
            Key: s3Key,
            Body: buffer,
            ContentType: mimetype,
        };
        s3Client_1.default.upload(params, (error, data) => {
            if (error) {
                console.error('Error uploading profile picture to S3:', error);
                reject(error);
            }
            else {
                resolve({
                    success: true,
                    fileUrl: s3Key
                });
            }
        });
    });
};
exports.default = { uploadProfilePictureToS3 };
