import clientModel from '../model/clientModel';
import IClient from '../interfaces/client';
import hashPasswordUtility from '../util/hashPassword';
import bcrypt from 'bcrypt';
import jwtUtil from '../util/jwtUtil';
import sendClientRegistrationEmailUtil from '../util/sendClientRegistrationEmail';
import sendAdminNotificationUtil from '../util/sendAdminClientRegistrationNotification';
import jobsModel from '../model/jobsModel';
import IJobs from '../interfaces/jobs';
import uploadLogoUtil from '../util/uploadLogoToS3';
import sendClientForgetPasswordOTPEmail from '../util/sendClientForgetPasswordOTPEmail';

const clientRegistration = async (clientData: Partial<IClient>, file?: Express.Multer.File): Promise<IClient> => {
    if (!clientData.password) {
        throw new Error('Password is required');
    }

    const hashedPassword = await hashPasswordUtility.hashPassword(clientData.password);

    const clientToSave = {
        ...clientData,
        password: hashedPassword
    };

    const newClient = new clientModel(clientToSave);
    const savedClient = await newClient.save();

    if (file) {
        const timestamp = Date.now();
        const fileName = `logo_${timestamp}_${file.originalname}`;

        try {
            const uploadResult = await uploadLogoUtil.uploadLogoToS3(
                savedClient.id,
                fileName,
                file.buffer,
                file.mimetype
            );

            savedClient.logo = uploadResult.fileUrl;
            await savedClient.save();
        } catch (error) {
            console.error(`Error uploading logo during registration: ${error}`);
        }
    }

    // Send registration email asynchronously (non-blocking)
    await sendClientRegistrationEmailUtil.sendClientRegistrationEmail(
        savedClient.email,
        savedClient.organizationName
    ).catch(error => {
        console.error(`Failed to send client registration email: ${error}`);
    });

    // Send admin notification email asynchronously (non-blocking)
    await sendAdminNotificationUtil.sendAdminNotificationEmail(
        savedClient.organizationName,
        savedClient.email,
        savedClient.id
    ).catch(error => {
        console.error(`Failed to send admin notification email: ${error}`);
    });

    return savedClient;
}

const clientLogin = async (email: string, password: string): Promise<{ client: IClient; token: string }> => {
    const client = await clientModel.findOne({ email }).select('+password');

    if (!client) {
        throw new Error('CLIENT_NOT_FOUND');
    }

    const isPasswordValid = await bcrypt.compare(password, client.password);

    if (!isPasswordValid) {
        throw new Error('BAD_CREDENTIALS');
    }

    if (client.status === 'registered') {
        throw new Error('ACCOUNT_NOT_ACTIVE');
    }

    if (client.status !== 'active') {
        throw new Error('ACCOUNT_DEACTIVATED');
    }

    // Generate JWT token
    const token = jwtUtil.generateToken({
        clientId: client.id,
        email: client.email,
        organizationName: client.organizationName
    });

    return { client, token };
}

const getClientById = async (clientId: string): Promise<IClient | null> => {
    const client = await clientModel.findById(clientId);
    return client;
}

const createJobByClient = async (clientId: string, jobData: Partial<IJobs>): Promise<IJobs> => {
    const client = await clientModel.findById(clientId);
    if (!client) throw new Error('Client not found');
    const jobToSave = {
        ...jobData,
        clientId,
        organizationName: client.organizationName,
    };

    const newJob = new jobsModel(jobToSave);
    const savedJob = await newJob.save();

    return savedJob;
};

const updateJobByClient = async (clientId: string, jobId: string, jobData: Partial<IJobs>): Promise<IJobs | null> => {
    const job = await jobsModel.findOne({ _id: jobId, clientId });

    if (!job) {
        throw new Error('JOB_NOT_FOUND_OR_UNAUTHORIZED');
    }

    const updatedJob = await jobsModel.findByIdAndUpdate(
        jobId,
        { $set: jobData },
        { new: true, runValidators: true }
    );

    return updatedJob;
};

const getAllJobsByClient = async (clientId: string): Promise<IJobs[]> => {
    const jobs = await jobsModel.find({ clientId }).sort({ createdAt: -1 });
    return jobs;
};

const updateClientProfile = async (
    clientId: string,
    updateData: Partial<IClient>,
    file?: Express.Multer.File
): Promise<IClient | null> => {
    if (file) {
        const timestamp = Date.now();
        const fileName = `logo_${timestamp}_${file.originalname}`;

        try {
            const uploadResult = await uploadLogoUtil.uploadLogoToS3(
                clientId,
                fileName,
                file.buffer,
                file.mimetype
            );

            updateData.logo = uploadResult.fileUrl;
        } catch (error) {
            console.error(`Error uploading logo to S3: ${error}`);
            throw new Error('LOGO_UPLOAD_FAILED');
        }
    }

    // Hash password if provided
    if (updateData.password) {
        updateData.password = await hashPasswordUtility.hashPassword(updateData.password);
    }

    const updatedClient = await clientModel.findByIdAndUpdate(
        clientId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedClient) {
        throw new Error('CLIENT_NOT_FOUND');
    }

    return updatedClient;
};

const getJobByClient = async (clientId: string, jobId: string): Promise<IJobs> => {
    const job = await jobsModel.findOne({ _id: jobId, clientId });

    if (!job) {
        throw new Error('JOB_NOT_FOUND_OR_UNAUTHORIZED');
    }

    return job;
};

const generateOTP = (): string => {
    return Math.floor(10000 + Math.random() * 90000).toString();
};

const sendForgetPasswordOTP = async (email: string): Promise<void> => {
    const client = await clientModel.findOne({ email });

    if (!client) {
        throw new Error('EMAIL_NOT_FOUND');
    }

    const otp = generateOTP();
    const otpExpiredAt = new Date();
    otpExpiredAt.setMinutes(otpExpiredAt.getMinutes() + 10);

    client.otp = otp;
    client.otpExpiredAt = otpExpiredAt;
    await client.save();

    // Send OTP email
    await sendClientForgetPasswordOTPEmail(
        client.primaryContact.firstName,
        client.primaryContact.lastName,
        client.email,
        otp
    );

    console.warn(`Forget password OTP generated and sent successfully for email: ${email}`);
};

// Validate OTP for forget password
const validateForgetPasswordOTP = async (email: string, otp: string): Promise<void> => {
    const client = await clientModel.findOne({ email });

    if (!client) {
        throw new Error('EMAIL_NOT_FOUND');
    }

    if (!client.otp || !client.otpExpiredAt) {
        throw new Error('INVALID_OTP');
    }

    const currentTime = new Date();
    if (currentTime > client.otpExpiredAt) {
        throw new Error('OTP_EXPIRED');
    }

    if (client.otp !== otp) {
        throw new Error('INVALID_OTP');
    }

    console.warn(`OTP validated successfully for email: ${email}`);
};

const updateClientPassword = async (email: string, newPassword: string): Promise<void> => {
    const client = await clientModel.findOne({ email }).select('+password');

    if (!client) {
        throw new Error('EMAIL_NOT_FOUND');
    }

    // Hash the new password
    const hashedPassword = await hashPasswordUtility.hashPassword(newPassword);

    // Update password and clear OTP fields
    client.password = hashedPassword;
    client.otp = undefined;
    client.otpExpiredAt = undefined;
    await client.save();

    console.warn(`Password updated successfully for email: ${email}`);
};

export default {
    clientRegistration,
    clientLogin,
    getClientById,
    createJobByClient,
    updateJobByClient,
    getAllJobsByClient,
    updateClientProfile,
    getJobByClient,
    sendForgetPasswordOTP,
    validateForgetPasswordOTP,
    updateClientPassword
};
