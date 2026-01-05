import s3Client from './s3Client';
import { bucketName } from '../config/awsS3Config';

const generatePresignedUrl = async (s3Key: string, expiresIn: number = 3600): Promise<string | null> => {
    if (!s3Key) {
        return null;
    }

    try {
        const params = {
            Bucket: bucketName,
            Key: s3Key,
            Expires: expiresIn // URL expires in seconds (default 1 hour)
        };

        const url = await s3Client.getSignedUrlPromise('getObject', params);
        return url;
    } catch (error) {
        console.error(`Error generating presigned URL: ${error}`);
        return null;
    }
};

export default { generatePresignedUrl };
