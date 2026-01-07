"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clientServices_1 = __importDefault(require("../services/clientServices"));
const clientMessages_1 = require("../constants/clientMessages");
const DUPLICATE_KEY_ERROR_CODE = 11000;
const clientRegistration = async (req, res) => {
    try {
        const file = req.file;
        const client = await clientServices_1.default.clientRegistration(req.body, file);
        return res.status(clientMessages_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: clientMessages_1.CLIENT_SUCCESS_MESSAGES.CLIENT_ADD_SUCCESS_MESSAGE,
            data: {
                id: client.id,
                email: client.email,
                organizationName: client.organizationName,
                mobile: client.mobile,
                gstin: client.gstin,
                panCard: client.panCard,
                category: client.category,
                logo: client.logo
            }
        });
    }
    catch (error) {
        if (error.code === DUPLICATE_KEY_ERROR_CODE) {
            return res.status(clientMessages_1.HTTP_STATUS.CONFLICT).json({
                success: false,
                message: clientMessages_1.CLIENT_ERROR_MESSAGES.CLIENT_ADD_ERROR_MESSAGE
            });
        }
        return res.status(clientMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: clientMessages_1.CLIENT_ERROR_MESSAGES.REGISTRATION_FAILED
        });
    }
};
const clientLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { client, token } = await clientServices_1.default.clientLogin(email, password);
        return res.status(clientMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: clientMessages_1.CLIENT_SUCCESS_MESSAGES.CLIENT_LOGIN_SUCCESS_MESSAGE,
            data: {
                token,
                client: {
                    id: client.id,
                    email: client.email,
                    organizationName: client.organizationName,
                    status: client.status,
                    primaryContact: client.primaryContact,
                    category: client.category,
                    logo: client.logo
                }
            }
        });
    }
    catch (error) {
        // Handle specific error cases using error mapping
        const errorMapping = clientMessages_1.CLIENT_LOGIN_ERROR_MAPPING[error.message];
        if (errorMapping) {
            return res.status(errorMapping.status).json({
                success: false,
                message: errorMapping.message
            });
        }
        // Generic error response
        return res.status(clientMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: clientMessages_1.CLIENT_ERROR_MESSAGES.LOGIN_FAILED
        });
    }
};
const getClientById = async (req, res) => {
    var _a;
    try {
        const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.clientId;
        const client = await clientServices_1.default.getClientById(clientId);
        if (!client) {
            return res.status(clientMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: clientMessages_1.CLIENT_ERROR_MESSAGES.CLIENT_NOT_FOUND
            });
        }
        return res.status(clientMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: clientMessages_1.CLIENT_SUCCESS_MESSAGES.CLIENT_FETCH_SUCCESS_MESSAGE,
            data: {
                id: client.id,
                email: client.email,
                organizationName: client.organizationName,
                status: client.status,
                emailStatus: client.emailStatus,
                mobile: client.mobile,
                mobileStatus: client.mobileStatus,
                location: client.location,
                gstin: client.gstin,
                panCard: client.panCard,
                primaryContact: client.primaryContact,
                secondaryContact: client.secondaryContact,
                category: client.category,
                logo: client.logo,
                createdAt: client.createdAt,
                updatedAt: client.updatedAt
            }
        });
    }
    catch (error) {
        return res.status(clientMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: clientMessages_1.CLIENT_ERROR_MESSAGES.FETCH_FAILED
        });
    }
};
const createJobByClient = async (req, res) => {
    var _a;
    try {
        const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.clientId;
        const jobData = req.body;
        const job = await clientServices_1.default.createJobByClient(clientId, jobData);
        return res.status(clientMessages_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: clientMessages_1.CLIENT_SUCCESS_MESSAGES.JOB_CREATED_SUCCESS_MESSAGE
        });
    }
    catch (error) {
        return res.status(clientMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: clientMessages_1.CLIENT_ERROR_MESSAGES.JOB_CREATION_FAILED
        });
    }
};
const updateJobByClient = async (req, res) => {
    var _a;
    try {
        const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.clientId;
        const _b = req.body, { jobId } = _b, jobData = __rest(_b, ["jobId"]);
        const updatedJob = await clientServices_1.default.updateJobByClient(clientId, jobId, jobData);
        return res.status(clientMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: clientMessages_1.CLIENT_SUCCESS_MESSAGES.JOB_UPDATED_SUCCESS_MESSAGE,
            data: {
                jobId: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.id,
                clientId: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.clientId,
                jobTitle: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.jobTitle,
                jobDescription: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.jobDescription,
                postStart: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.postStart,
                postEnd: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.postEnd,
                noOfPositions: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.noOfPositions,
                minimumSalary: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.minimumSalary,
                maximumSalary: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.maximumSalary,
                jobType: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.jobType,
                jobLocation: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.jobLocation,
                minimumExperience: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.minimumExperience,
                maximumExperience: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.maximumExperience,
                status: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.status,
                createdAt: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.createdAt,
                updatedAt: updatedJob === null || updatedJob === void 0 ? void 0 : updatedJob.updatedAt
            }
        });
    }
    catch (error) {
        if (error.message === 'JOB_NOT_FOUND_OR_UNAUTHORIZED') {
            return res.status(clientMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: clientMessages_1.CLIENT_ERROR_MESSAGES.JOB_NOT_FOUND_OR_UNAUTHORIZED
            });
        }
        return res.status(clientMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: clientMessages_1.CLIENT_ERROR_MESSAGES.JOB_UPDATE_FAILED
        });
    }
};
const getAllJobsByClient = async (req, res) => {
    var _a;
    try {
        const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.clientId;
        const jobs = await clientServices_1.default.getAllJobsByClient(clientId);
        const formattedJobs = jobs.map(job => ({
            clientId: job.clientId,
            organizationName: job.organizationName,
            jobTitle: job.jobTitle,
            jobDescription: job.jobDescription,
            postStart: job.postStart,
            postEnd: job.postEnd,
            noOfPositions: job.noOfPositions,
            minimumSalary: job.minimumSalary,
            maximumSalary: job.maximumSalary,
            jobType: job.jobType,
            jobLocation: job.jobLocation,
            minimumExperience: job.minimumExperience,
            maximumExperience: job.maximumExperience,
            status: job.status,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
            id: job.id
        }));
        return res.status(clientMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: clientMessages_1.CLIENT_SUCCESS_MESSAGES.JOBS_FETCHED_SUCCESS_MESSAGE,
            data: formattedJobs
        });
    }
    catch (error) {
        console.error(`Error in fetching jobs: ${error}`);
        return res.status(clientMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: clientMessages_1.CLIENT_ERROR_MESSAGES.JOBS_FETCH_FAILED
        });
    }
};
const updateClientProfile = async (req, res) => {
    var _a;
    try {
        const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.clientId;
        if (!clientId) {
            return res.status(clientMessages_1.HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'Client ID not found in token'
            });
        }
        const file = req.file;
        const updatedClient = await clientServices_1.default.updateClientProfile(clientId, req.body, file);
        if (!updatedClient) {
            return res.status(clientMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: clientMessages_1.CLIENT_ERROR_MESSAGES.CLIENT_NOT_FOUND
            });
        }
        return res.status(clientMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: clientMessages_1.CLIENT_SUCCESS_MESSAGES.CLIENT_PROFILE_UPDATED_SUCCESS_MESSAGE,
            data: {
                clientId: updatedClient._id,
                email: updatedClient.email,
                organizationName: updatedClient.organizationName,
                primaryContact: updatedClient.primaryContact,
                secondaryContact: updatedClient.secondaryContact,
                mobile: updatedClient.mobile,
                location: updatedClient.location,
                gstin: updatedClient.gstin,
                panCard: updatedClient.panCard,
                status: updatedClient.status,
                emailStatus: updatedClient.emailStatus,
                mobileStatus: updatedClient.mobileStatus,
                category: updatedClient.category,
                logo: updatedClient.logo,
                updatedAt: updatedClient.updatedAt
            }
        });
    }
    catch (error) {
        console.error(`Error in updating client profile: ${error}`);
        if (error.message === 'CLIENT_NOT_FOUND') {
            return res.status(clientMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: clientMessages_1.CLIENT_ERROR_MESSAGES.CLIENT_NOT_FOUND
            });
        }
        if (error.message === 'LOGO_UPLOAD_FAILED') {
            return res.status(clientMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: clientMessages_1.CLIENT_ERROR_MESSAGES.LOGO_UPLOAD_FAILED
            });
        }
        return res.status(clientMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: clientMessages_1.CLIENT_ERROR_MESSAGES.CLIENT_PROFILE_UPDATE_FAILED
        });
    }
};
const getJobByClient = async (req, res) => {
    var _a;
    try {
        const clientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.clientId;
        const { jobId } = req.params;
        const job = await clientServices_1.default.getJobByClient(clientId, jobId);
        return res.status(clientMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: clientMessages_1.CLIENT_SUCCESS_MESSAGES.JOB_FETCH_SUCCESS_MESSAGE,
            data: job
        });
    }
    catch (error) {
        console.error(`Error in fetching job by client: ${error}`);
        if (error.message === 'JOB_NOT_FOUND_OR_UNAUTHORIZED') {
            return res.status(clientMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: clientMessages_1.CLIENT_ERROR_MESSAGES.JOB_NOT_FOUND_OR_UNAUTHORIZED
            });
        }
        return res.status(clientMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: clientMessages_1.CLIENT_ERROR_MESSAGES.JOBS_FETCH_FAILED
        });
    }
};
const sendForgetPasswordOTP = async (req, res) => {
    try {
        const { email } = req.body;
        await clientServices_1.default.sendForgetPasswordOTP(email);
        console.warn(`Forget password OTP sent successfully to: ${email}`);
        return res.status(clientMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: clientMessages_1.CLIENT_SUCCESS_MESSAGES.OTP_SENT_SUCCESS,
            data: {
                email
            }
        });
    }
    catch (error) {
        if (error.message === 'EMAIL_NOT_FOUND') {
            console.error(`Failed to send OTP - Email not found: ${req.body.email}`);
            return res.status(clientMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: clientMessages_1.CLIENT_ERROR_MESSAGES.EMAIL_NOT_FOUND
            });
        }
        console.error(`Error sending OTP for forget password: ${error}`);
        return res.status(clientMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: clientMessages_1.CLIENT_ERROR_MESSAGES.OTP_GENERATION_FAILED
        });
    }
};
const validateForgetPasswordOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        await clientServices_1.default.validateForgetPasswordOTP(email, otp);
        console.warn(`OTP validated successfully for email: ${email}`);
        return res.status(clientMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: clientMessages_1.CLIENT_SUCCESS_MESSAGES.OTP_VALIDATION_SUCCESS
        });
    }
    catch (error) {
        if (error.message === 'EMAIL_NOT_FOUND') {
            console.error(`Failed to validate OTP - Email not found: ${req.body.email}`);
            return res.status(clientMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: clientMessages_1.CLIENT_ERROR_MESSAGES.EMAIL_NOT_FOUND
            });
        }
        if (error.message === 'OTP_EXPIRED') {
            console.error(`Failed to validate OTP - OTP expired for email: ${req.body.email}`);
            return res.status(clientMessages_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: clientMessages_1.CLIENT_ERROR_MESSAGES.OTP_EXPIRED
            });
        }
        if (error.message === 'INVALID_OTP') {
            console.error(`Failed to validate OTP - Invalid OTP for email: ${req.body.email}`);
            return res.status(clientMessages_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: clientMessages_1.CLIENT_ERROR_MESSAGES.INVALID_OTP
            });
        }
        console.error(`Error validating OTP: ${error}`);
        return res.status(clientMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: clientMessages_1.CLIENT_ERROR_MESSAGES.OTP_VALIDATION_FAILED
        });
    }
};
const updateClientPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        await clientServices_1.default.updateClientPassword(email, newPassword);
        console.warn(`Password updated successfully for email: ${email}`);
        return res.status(clientMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: clientMessages_1.CLIENT_SUCCESS_MESSAGES.PASSWORD_UPDATED_SUCCESS
        });
    }
    catch (error) {
        if (error.message === 'EMAIL_NOT_FOUND') {
            console.error(`Failed to update password - Email not found: ${req.body.email}`);
            return res.status(clientMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: clientMessages_1.CLIENT_ERROR_MESSAGES.EMAIL_NOT_FOUND
            });
        }
        console.error(`Error updating client password: ${error}`);
        return res.status(clientMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: clientMessages_1.CLIENT_ERROR_MESSAGES.PASSWORD_UPDATE_FAILED
        });
    }
};
exports.default = {
    clientRegistration,
    clientLogin,
    getClientById,
    updateClientProfile,
    createJobByClient,
    updateJobByClient,
    getAllJobsByClient,
    getJobByClient,
    sendForgetPasswordOTP,
    validateForgetPasswordOTP,
    updateClientPassword
};
