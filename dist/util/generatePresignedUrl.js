"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3Client_1 = __importDefault(require("./s3Client"));
const awsS3Config_1 = require("../config/awsS3Config");
const generatePresignedUrl = async (s3Key, expiresIn = 3600) => {
    if (!s3Key) {
        return null;
    }
    try {
        const params = {
            Bucket: awsS3Config_1.bucketName,
            Key: s3Key,
            Expires: expiresIn // URL expires in seconds (default 1 hour)
        };
        const url = await s3Client_1.default.getSignedUrlPromise('getObject', params);
        return url;
    }
    catch (error) {
        console.error('Error generating presigned URL:', error);
        return null;
    }
};
exports.default = { generatePresignedUrl };
