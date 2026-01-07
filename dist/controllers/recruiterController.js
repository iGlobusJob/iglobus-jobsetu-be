"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recruiterMessages_1 = require("../constants/recruiterMessages");
const recruiterServices_1 = __importDefault(require("../services/recruiterServices"));
const recruiterLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { recruiter, token } = await recruiterServices_1.default.recruiterLogin(email, password);
        return res.status(recruiterMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: recruiterMessages_1.RECRUITER_SUCCESS_MESSAGE.RECRUITER_LOGIN_SUCCESS_MESSAGE,
            firstName: recruiter.firstName,
            lastName: recruiter.lastName,
            email: recruiter.email,
            token,
        });
    }
    catch (error) {
        const errorConfig = recruiterMessages_1.ERROR_MAPPING[error.message];
        if (errorConfig) {
            return res.status(errorConfig.status).json({
                success: false,
                message: errorConfig.message,
            });
        }
        return res.status(recruiterMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: recruiterMessages_1.RECRUITER_ERROR_MESSAGES.LOGIN_FAILED,
        });
    }
};
const getAllJobsByRecruiter = async (req, res) => {
    try {
        const jobsResponse = await recruiterServices_1.default.getAllJobsService();
        return res.status(recruiterMessages_1.HTTP_STATUS.OK).json(jobsResponse);
    }
    catch (error) {
        console.error(`Error fetching jobs by Recruiter: ${error}`);
        return res.status(recruiterMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: recruiterMessages_1.RECRUITER_ERROR_MESSAGES.RECRUITER_FETCH_JOBS_FAILED,
        });
    }
};
const getJobByIdByRecruiter = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await recruiterServices_1.default.getJobByIdService(jobId);
        if (!job) {
            return res.status(recruiterMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: recruiterMessages_1.RECRUITER_ERROR_MESSAGES.JOB_NOT_FOUND,
            });
        }
        return res.status(recruiterMessages_1.HTTP_STATUS.OK).json({
            success: true,
            data: job,
        });
    }
    catch (error) {
        console.error(`Error fetching job by ID: ${error}`);
        return res.status(recruiterMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: recruiterMessages_1.RECRUITER_ERROR_MESSAGES.JOB_FETCH_FAILED,
        });
    }
};
const getAllClientsByRecruiter = async (req, res) => {
    try {
        const clientsResponse = await recruiterServices_1.default.getAllClientsService();
        return res.status(recruiterMessages_1.HTTP_STATUS.OK).json(clientsResponse);
    }
    catch (error) {
        console.error(`Error fetching clients by Recruiter: ${error}`);
        return res.status(recruiterMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: recruiterMessages_1.RECRUITER_ERROR_MESSAGES.CLIENTS_FETCH_ERROR_MESSAGE,
        });
    }
};
const getClientByIdByRecruiter = async (req, res) => {
    try {
        const { clientId } = req.params;
        const client = await recruiterServices_1.default.getClientByIdService(clientId);
        if (!client) {
            return res.status(recruiterMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: recruiterMessages_1.RECRUITER_ERROR_MESSAGES.CLIENT_NOT_FOUND,
            });
        }
        return res.status(recruiterMessages_1.HTTP_STATUS.OK).json({
            success: true,
            data: client,
        });
    }
    catch (error) {
        console.error(`Error fetching client by ID: ${error}`);
        return res.status(recruiterMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: recruiterMessages_1.RECRUITER_ERROR_MESSAGES.CLIENT_FETCH_FAILED,
        });
    }
};
const getAllCandidatesByRecruiter = async (req, res) => {
    try {
        const candidatesResponse = await recruiterServices_1.default.getAllCandidatesService();
        return res.status(recruiterMessages_1.HTTP_STATUS.OK).json(candidatesResponse);
    }
    catch (error) {
        console.error(`Error fetching candidates by Recruiter: ${error}`);
        return res.status(recruiterMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: recruiterMessages_1.RECRUITER_ERROR_MESSAGES.CANDIDATE_FETCH_FAILED,
        });
    }
};
const getCandidateByIdByRecruiter = async (req, res) => {
    try {
        const { candidateId } = req.params;
        const candidate = await recruiterServices_1.default.getCandidateByIdService(candidateId);
        if (!candidate) {
            return res.status(recruiterMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: recruiterMessages_1.RECRUITER_ERROR_MESSAGES.CANDIDATE_NOT_FOUND,
            });
        }
        return res.status(recruiterMessages_1.HTTP_STATUS.OK).json({
            success: true,
            data: candidate,
        });
    }
    catch (error) {
        console.error(`Error fetching candidate by ID: ${error}`);
        return res.status(recruiterMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: recruiterMessages_1.RECRUITER_ERROR_MESSAGES.CANDIDATE_FETCH_FAILED,
        });
    }
};
exports.default = {
    recruiterLogin,
    getAllJobsByRecruiter,
    getJobByIdByRecruiter,
    getAllClientsByRecruiter,
    getClientByIdByRecruiter,
    getAllCandidatesByRecruiter,
    getCandidateByIdByRecruiter,
};
