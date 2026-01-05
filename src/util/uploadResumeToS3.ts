import s3Client from './s3Client';
import { bucketName, candidateFolder } from '../config/awsS3Config';

const uploadResumeToS3 = async (
    candidateId: string,
    fileName: string,
    buffer: Buffer,
    mimetype: string
): Promise<{ success: boolean; fileUrl: string }> => {
    return new Promise((resolve, reject) => {
        const s3Key = `${candidateFolder}/${candidateId}/resumes/${fileName}`;

        const params = {
            Bucket: bucketName,
            Key: s3Key,
            Body: buffer,
            ContentType: mimetype,
        };

        s3Client.upload(params, (error: any, data: any) => {
            if (error) {
                console.error(`Error uploading resume to S3: ${error}`);
                reject(error);
            } else {
                resolve({
                    success: true,
                    fileUrl: s3Key
                });
            }
        });
    });
};

export default { uploadResumeToS3 };
