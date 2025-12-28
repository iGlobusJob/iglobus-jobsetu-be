"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clientModel_1 = __importDefault(require("../model/clientModel"));
const hashPassword_1 = __importDefault(require("../util/hashPassword"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtUtil_1 = __importDefault(require("../util/jwtUtil"));
const sendClientRegistrationEmail_1 = __importDefault(require("../util/sendClientRegistrationEmail"));
const sendAdminClientRegistrationNotification_1 = __importDefault(require("../util/sendAdminClientRegistrationNotification"));
const jobsModel_1 = __importDefault(require("../model/jobsModel"));
const uploadLogoToS3_1 = __importDefault(require("../util/uploadLogoToS3"));
const clientRegistration = async (clientData, file) => {
    if (!clientData.password) {
        throw new Error('Password is required');
    }
    const hashedPassword = await hashPassword_1.default.hashPassword(clientData.password);
    const clientToSave = Object.assign(Object.assign({}, clientData), { password: hashedPassword });
    const newClient = new clientModel_1.default(clientToSave);
    const savedClient = await newClient.save();
    if (file) {
        const timestamp = Date.now();
        const fileName = `logo_${timestamp}_${file.originalname}`;
        try {
            const uploadResult = await uploadLogoToS3_1.default.uploadLogoToS3(savedClient.id, fileName, file.buffer, file.mimetype);
            savedClient.logo = uploadResult.fileUrl;
            await savedClient.save();
        }
        catch (error) {
            console.error('Error uploading logo during registration:', error);
        }
    }
    // Send registration email asynchronously (non-blocking)
    await sendClientRegistrationEmail_1.default.sendClientRegistrationEmail(savedClient.email, savedClient.organizationName).catch(error => {
        console.error('Failed to send client registration email:', error);
    });
    // Send admin notification email asynchronously (non-blocking)
    await sendAdminClientRegistrationNotification_1.default.sendAdminNotificationEmail(savedClient.organizationName, savedClient.email, savedClient.id).catch(error => {
        console.error('Failed to send admin notification email:', error);
    });
    return savedClient;
};
const clientLogin = async (email, password) => {
    const client = await clientModel_1.default.findOne({ email }).select('+password');
    if (!client) {
        throw new Error('CLIENT_NOT_FOUND');
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, client.password);
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
    const token = jwtUtil_1.default.generateToken({
        clientId: client.id,
        email: client.email,
        organizationName: client.organizationName
    });
    return { client, token };
};
const getClientById = async (clientId) => {
    const client = await clientModel_1.default.findById(clientId);
    return client;
};
const createJobByClient = async (clientId, jobData) => {
    const client = await clientModel_1.default.findById(clientId);
    if (!client)
        throw new Error("Client not found");
    const jobToSave = Object.assign(Object.assign({}, jobData), { clientId, organizationName: client.organizationName });
    const newJob = new jobsModel_1.default(jobToSave);
    const savedJob = await newJob.save();
    return savedJob;
};
const updateJobByClient = async (clientId, jobId, jobData) => {
    const job = await jobsModel_1.default.findOne({ _id: jobId, clientId });
    if (!job) {
        throw new Error('JOB_NOT_FOUND_OR_UNAUTHORIZED');
    }
    const updatedJob = await jobsModel_1.default.findByIdAndUpdate(jobId, { $set: jobData }, { new: true, runValidators: true });
    return updatedJob;
};
const getAllJobsByClient = async (clientId) => {
    const jobs = await jobsModel_1.default.find({ clientId }).sort({ createdAt: -1 });
    return jobs;
};
const updateClientProfile = async (clientId, updateData, file) => {
    if (file) {
        const timestamp = Date.now();
        const fileName = `logo_${timestamp}_${file.originalname}`;
        try {
            const uploadResult = await uploadLogoToS3_1.default.uploadLogoToS3(clientId, fileName, file.buffer, file.mimetype);
            updateData.logo = uploadResult.fileUrl;
        }
        catch (error) {
            console.error('Error uploading logo to S3:', error);
            throw new Error('LOGO_UPLOAD_FAILED');
        }
    }
    // Hash password if provided
    if (updateData.password) {
        updateData.password = await hashPassword_1.default.hashPassword(updateData.password);
    }
    const updatedClient = await clientModel_1.default.findByIdAndUpdate(clientId, { $set: updateData }, { new: true, runValidators: true });
    if (!updatedClient) {
        throw new Error('CLIENT_NOT_FOUND');
    }
    return updatedClient;
};
const getJobByClient = async (clientId, jobId) => {
    const job = await jobsModel_1.default.findOne({ _id: jobId, clientId });
    if (!job) {
        throw new Error('JOB_NOT_FOUND_OR_UNAUTHORIZED');
    }
    return job;
};
exports.default = { clientRegistration, clientLogin, getClientById, createJobByClient, updateJobByClient, getAllJobsByClient, updateClientProfile, getJobByClient };
