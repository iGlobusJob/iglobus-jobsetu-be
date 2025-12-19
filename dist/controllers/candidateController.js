"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const candidateServices_1 = __importDefault(require("../services/candidateServices"));
const candidateMessages_1 = require("../constants/candidateMessages");
const candidateJoin = async (req, res) => {
    try {
        const { email } = req.body;
        const { candidate } = await candidateServices_1.default.candidateJoin(email);
        return res.status(candidateMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: candidateMessages_1.CANDIDATE_SUCCESS_MESSAGES.OTP_SENT_SUCCESS,
            data: {
                email: candidate.email
            }
        });
    }
    catch (error) {
        return res.status(candidateMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: candidateMessages_1.CANDIDATE_ERROR_MESSAGES.OTP_GENERATION_FAILED
        });
    }
};
const validateOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const { candidate, token, profilePictureUrl } = await candidateServices_1.default.validateOTP(email, otp);
        return res.status(candidateMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: candidateMessages_1.CANDIDATE_SUCCESS_MESSAGES.OTP_VALIDATION_SUCCESS,
            data: {
                token,
                candidate: {
                    id: candidate.id,
                    email: candidate.email,
                    profilePictureUrl: profilePictureUrl,
                    firstName: candidate.firstName,
                    lastName: candidate.lastName
                }
            }
        });
    }
    catch (error) {
        const errorConfig = candidateMessages_1.ERROR_MAPPING[error.message];
        if (errorConfig) {
            return res.status(errorConfig.status).json({
                success: false,
                message: errorConfig.message
            });
        }
        return res.status(candidateMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: candidateMessages_1.CANDIDATE_ERROR_MESSAGES.OTP_VALIDATION_FAILED
        });
    }
};
const getCandidateById = async (req, res) => {
    var _a;
    try {
        const candidateId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.candidateId;
        const candidateResponse = await candidateServices_1.default.getCandidateById(candidateId);
        return res.status(candidateMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: candidateMessages_1.CANDIDATE_SUCCESS_MESSAGES.CANDIDATE_FETCH_SUCCESS_MESSAGE,
            data: candidateResponse.data
        });
    }
    catch (error) {
        const errorConfig = candidateMessages_1.ERROR_MAPPING[error.message];
        if (errorConfig) {
            return res.status(errorConfig.status).json({
                success: false,
                message: errorConfig.message
            });
        }
        return res.status(candidateMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: candidateMessages_1.CANDIDATE_ERROR_MESSAGES.CANDIDATE_ERROR_FETCH_MESSAGE
        });
    }
};
const getAllCandidates = async (req, res) => {
    try {
        const candidateResponse = await candidateServices_1.default.getAllCandidateService();
        return res.status(200).json(candidateResponse);
    }
    catch (error) {
        console.error(`Error in fetching Candidate details: ${error}`);
        res.status(500).json({ success: false, message: candidateMessages_1.CANDIDATE_ERROR_MESSAGES.FETCH_ALLCANDIDATES_ERROR_MESSAGE });
    }
    ;
};
const getAllJobsByCandidate = async (req, res) => {
    try {
        const jobs = await candidateServices_1.default.getAllJobsByCandidate();
        return res.status(candidateMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: candidateMessages_1.CANDIDATE_SUCCESS_MESSAGES.JOBS_FETCHED_SUCCESS_MESSAGE,
            data: jobs
        });
    }
    catch (error) {
        console.error(`Error in fetching jobs by candidate: `, error);
        return res.status(candidateMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: candidateMessages_1.CANDIDATE_ERROR_MESSAGES.JOBS_FETCH_FAILED
        });
    }
};
const updateCandidateProfile = async (req, res) => {
    var _a, _b, _c;
    try {
        const candidateId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.candidateId;
        if (!candidateId) {
            return res.status(candidateMessages_1.HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'Candidate ID not found in token'
            });
        }
        const files = req.files;
        const resume = (_b = files === null || files === void 0 ? void 0 : files.profile) === null || _b === void 0 ? void 0 : _b[0];
        const profilePicture = (_c = files === null || files === void 0 ? void 0 : files.profilepicture) === null || _c === void 0 ? void 0 : _c[0];
        const updatedcandidate = await candidateServices_1.default.updateCandidateService(candidateId, req.body, {
            resume,
            profilePicture
        });
        if (!updatedcandidate) {
            return res.status(candidateMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: candidateMessages_1.CANDIDATE_ERROR_MESSAGES.CANDIDATE_NOT_FOUND
            });
        }
        return res.status(candidateMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: candidateMessages_1.CANDIDATE_SUCCESS_MESSAGES.CANDIDATE_UPDATED_SUCCESS_MESSAGE,
            data: {
                id: updatedcandidate.id,
                email: updatedcandidate.email,
                firstName: updatedcandidate.firstName,
                lastName: updatedcandidate.lastName,
                mobileNumber: updatedcandidate.mobileNumber,
                address: updatedcandidate.address,
                dateOfBirth: updatedcandidate.dateOfBirth,
                gender: updatedcandidate.gender,
                category: updatedcandidate.category,
                profile: updatedcandidate.profile,
                profilePicture: updatedcandidate.profilePicture
            }
        });
    }
    catch (error) {
        console.error(`Error in updating candidate profile: ${error} `);
        if (error.message === 'CANDIDATE_NOT_FOUND') {
            return res.status(candidateMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: candidateMessages_1.CANDIDATE_ERROR_MESSAGES.CANDIDATE_NOT_FOUND
            });
        }
        if (error.message === 'RESUME_UPLOAD_FAILED') {
            return res.status(candidateMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: candidateMessages_1.CANDIDATE_ERROR_MESSAGES.RESUME_UPLOAD_FAILED
            });
        }
        if (error.message === 'PROFILE_PICTURE_UPLOAD_FAILED') {
            return res.status(candidateMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: candidateMessages_1.CANDIDATE_ERROR_MESSAGES.PROFILE_PICTURE_UPLOAD_FAILED
            });
        }
        return res.status(candidateMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: candidateMessages_1.CANDIDATE_ERROR_MESSAGES.CANDIDATE_PROFILE_UPDATE_FAILED
        });
    }
};
const applyToJob = async (req, res) => {
    var _a;
    try {
        const candidateId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.candidateId;
        const { jobId } = req.body;
        const candidateJob = await candidateServices_1.default.applyToJob(candidateId, jobId);
        return res.status(candidateMessages_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: candidateMessages_1.CANDIDATE_SUCCESS_MESSAGES.JOB_APPLIED_SUCCESS,
            data: {
                id: candidateJob.id,
                jobId: candidateJob.jobId,
                candidateId: candidateJob.candidateId,
                isJobApplied: candidateJob.isJobApplied,
                appliedAt: candidateJob.appliedAt
            }
        });
    }
    catch (error) {
        const errorConfig = candidateMessages_1.ERROR_MAPPING[error.message];
        if (errorConfig) {
            return res.status(errorConfig.status).json({
                success: false,
                message: errorConfig.message
            });
        }
        return res.status(candidateMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: candidateMessages_1.CANDIDATE_ERROR_MESSAGES.JOB_APPLY_FAILED
        });
    }
};
const saveJob = async (req, res) => {
    var _a;
    try {
        const candidateId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.candidateId;
        const { jobId } = req.body;
        const candidateJob = await candidateServices_1.default.saveJob(candidateId, jobId);
        return res.status(candidateMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: candidateMessages_1.CANDIDATE_SUCCESS_MESSAGES.JOB_SAVED_SUCCESS,
            data: {
                id: candidateJob.id,
                jobId: candidateJob.jobId,
                candidateId: candidateJob.candidateId,
                isJobSaved: candidateJob.isJobSaved,
                savedAt: candidateJob.savedAt
            }
        });
    }
    catch (error) {
        const errorConfig = candidateMessages_1.ERROR_MAPPING[error.message];
        if (errorConfig) {
            return res.status(errorConfig.status).json({
                success: false,
                message: errorConfig.message
            });
        }
        return res.status(candidateMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: candidateMessages_1.CANDIDATE_ERROR_MESSAGES.JOB_SAVE_FAILED
        });
    }
};
const unsaveJob = async (req, res) => {
    var _a;
    try {
        const candidateId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.candidateId;
        const { jobId } = req.body;
        const candidateJob = await candidateServices_1.default.unsaveJob(candidateId, jobId);
        return res.status(candidateMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: candidateMessages_1.CANDIDATE_SUCCESS_MESSAGES.JOB_UNSAVED_SUCCESS,
            data: {
                id: candidateJob.id,
                jobId: candidateJob.jobId,
                candidateId: candidateJob.candidateId,
                isJobSaved: candidateJob.isJobSaved
            }
        });
    }
    catch (error) {
        const errorConfig = candidateMessages_1.ERROR_MAPPING[error.message];
        if (errorConfig) {
            return res.status(errorConfig.status).json({
                success: false,
                message: errorConfig.message
            });
        }
        return res.status(candidateMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: candidateMessages_1.CANDIDATE_ERROR_MESSAGES.JOB_UNSAVE_FAILED
        });
    }
};
const getMyJobs = async (req, res) => {
    var _a;
    try {
        const candidateId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.candidateId;
        const myJobs = await candidateServices_1.default.getMyJobs(candidateId);
        return res.status(candidateMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: candidateMessages_1.CANDIDATE_SUCCESS_MESSAGES.MY_JOBS_FETCHED_SUCCESS,
            data: myJobs
        });
    }
    catch (error) {
        console.error(`Error in fetching my jobs: `, error);
        return res.status(candidateMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: candidateMessages_1.CANDIDATE_ERROR_MESSAGES.MY_JOBS_FETCH_FAILED
        });
    }
};
exports.default = { candidateJoin, validateOTP, getCandidateById, getAllCandidates, getAllJobsByCandidate, updateCandidateProfile, applyToJob, saveJob, unsaveJob, getMyJobs };
