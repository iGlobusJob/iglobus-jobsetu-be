import s3Client from './s3Client';
import { bucketName } from '../config/awsS3Config';

const clientsFolder = 'clients';

const uploadLogoToS3 = async (
    clientId: string,
    fileName: string,
    buffer: Buffer,
    mimetype: string
): Promise<{ success: boolean; fileUrl: string }> => {
    return new Promise((resolve, reject) => {
        const s3Key = `${clientsFolder}/${clientId}/logos/${fileName}`;

        const params = {
            Bucket: bucketName,
            Key: s3Key,
            Body: buffer,
            ContentType: mimetype
            // Note: ACL removed - bucket policy will handle public access
        };

        s3Client.upload(params, (error: any, data: any) => {
            if (error) {
                console.error(`Error uploading logo to S3: ${error}`);
                reject(error);
            } else {
                // Return the public URL
                const publicUrl = `https://${bucketName}.s3.amazonaws.com/${s3Key}`;
                resolve({
                    success: true,
                    fileUrl: publicUrl
                });
            }
        });
    });
};

export default { uploadLogoToS3 };
