import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configure AWS Region and Credentials
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Create an S3 instance
const s3 = new AWS.S3();

export default s3;
