"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commonServices_1 = __importDefault(require("../services/commonServices"));
const commonMessages_1 = require("../constants/commonMessages");
const getAllCandidates = async (req, res) => {
    try {
        const candidateResponse = await commonServices_1.default.getAllCandidates();
        return res.status(commonMessages_1.HTTP_STATUS.OK).json(candidateResponse);
    }
    catch (error) {
        console.error(`Error in fetching all candidates: ${error}`);
        return res.status(commonMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: commonMessages_1.COMMON_ERROR_MESSAGES.CANDIDATES_FETCH_FAILED
        });
    }
};
const getCandidateById = async (req, res) => {
    try {
        const { candidateID } = req.params;
        const candidateResponse = await commonServices_1.default.getCandidateById(candidateID);
        return res.status(commonMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: commonMessages_1.COMMON_SUCCESS_MESSAGES.CANDIDATE_FETCH_SUCCESS_MESSAGE,
            data: candidateResponse.data
        });
    }
    catch (error) {
        console.error(`Error in fetching candidate details: `, error);
        if (error.message === 'CANDIDATE_NOT_FOUND') {
            return res.status(commonMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: commonMessages_1.COMMON_ERROR_MESSAGES.CANDIDATE_NOT_FOUND
            });
        }
        return res.status(commonMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: commonMessages_1.COMMON_ERROR_MESSAGES.CANDIDATE_FETCH_FAILED
        });
    }
};
const getJobById = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await commonServices_1.default.getJobById(jobId);
        return res.status(commonMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: commonMessages_1.COMMON_SUCCESS_MESSAGES.JOB_FETCH_SUCCESS_MESSAGE,
            data: job
        });
    }
    catch (error) {
        console.error(`Error in fetching job details: `, error);
        if (error.message === 'JOB_NOT_FOUND') {
            return res.status(commonMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: commonMessages_1.COMMON_ERROR_MESSAGES.JOB_NOT_FOUND
            });
        }
        return res.status(commonMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: commonMessages_1.COMMON_ERROR_MESSAGES.JOB_FETCH_FAILED
        });
    }
};
const getAllJobs = async (req, res) => {
    try {
        const allJobsResponse = await commonServices_1.default.getAllJobs();
        return res.status(commonMessages_1.HTTP_STATUS.OK).json(allJobsResponse);
    }
    catch (error) {
        console.error(`Error in fetching all jobs : ${error}`);
        res.status(commonMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: commonMessages_1.COMMON_ERROR_MESSAGES.JOBS_FETCH_FAILED });
    }
    ;
};
const sendContactUsMail = async (req, res) => {
    try {
        const mailDetailsToFire = req.body;
        const emailResponse = await commonServices_1.default.sendContactUsMail(mailDetailsToFire);
        return res.status(commonMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: commonMessages_1.COMMON_SUCCESS_MESSAGES.EMAIL_SEND_SUCCESS
        });
    }
    catch (error) {
        console.error(`Error in sending contact us mail: ${error}`);
        return res.status(commonMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: commonMessages_1.COMMON_ERROR_MESSAGES.EMAIL_SEND_FAILED
        });
    }
};
exports.default = { getAllCandidates, getCandidateById, getJobById, getAllJobs, sendContactUsMail };
