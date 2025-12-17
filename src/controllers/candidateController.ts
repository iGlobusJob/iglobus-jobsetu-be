import { Request, Response } from 'express';
import candidateService from '../services/candidateServices';
import { CANDIDATE_SUCCESS_MESSAGES, CANDIDATE_ERROR_MESSAGES, HTTP_STATUS, ERROR_MAPPING } from '../constants/candidateMessages';

const candidateJoin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email } = req.body;

        const { candidate } = await candidateService.candidateJoin(email);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: CANDIDATE_SUCCESS_MESSAGES.OTP_SENT_SUCCESS,
            data: {
                email: candidate.email
            }
        });
    } catch (error: any) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CANDIDATE_ERROR_MESSAGES.OTP_GENERATION_FAILED
        });
    }
};

const validateOTP = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, otp } = req.body;

        const { candidate, token, profilePictureUrl } = await candidateService.validateOTP(email, otp);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: CANDIDATE_SUCCESS_MESSAGES.OTP_VALIDATION_SUCCESS,
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
    } catch (error: any) {
        const errorConfig = ERROR_MAPPING[error.message];

        if (errorConfig) {
            return res.status(errorConfig.status).json({
                success: false,
                message: errorConfig.message
            });
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CANDIDATE_ERROR_MESSAGES.OTP_VALIDATION_FAILED
        });
    }
};

const getCandidateById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const candidateId = req.user?.candidateId as string;
        const candidateResponse = await candidateService.getCandidateById(candidateId);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: CANDIDATE_SUCCESS_MESSAGES.CANDIDATE_FETCH_SUCCESS_MESSAGE,
            data: candidateResponse.data
        });
    } catch (error: any) {
        const errorConfig = ERROR_MAPPING[error.message];

        if (errorConfig) {
            return res.status(errorConfig.status).json({
                success: false,
                message: errorConfig.message
            });
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CANDIDATE_ERROR_MESSAGES.CANDIDATE_ERROR_FETCH_MESSAGE
        });
    }
};

const getAllCandidates = async (req: Request, res: Response) => {
    try {
        const candidateResponse = await candidateService.getAllCandidateService();
        return res.status(200).json(candidateResponse);

    } catch (error) {
        console.error(`Error in fetching Candidate details: ${error}`);
        res.status(500).json({ success: false, message: CANDIDATE_ERROR_MESSAGES.FETCH_ALLCANDIDATES_ERROR_MESSAGE });
    };
};

const getAllJobsByCandidate = async (req: Request, res: Response): Promise<Response> => {
    try {
        const jobs = await candidateService.getAllJobsByCandidate();

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: CANDIDATE_SUCCESS_MESSAGES.JOBS_FETCHED_SUCCESS_MESSAGE,
            data: jobs
        });
    } catch (error: any) {
        console.error(`Error in fetching jobs by candidate: `, error);

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CANDIDATE_ERROR_MESSAGES.JOBS_FETCH_FAILED
        });
    }
};

const updateCandidateProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const candidateId = req.user?.candidateId;

        if (!candidateId) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'Candidate ID not found in token'
            });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const resume = files?.profile?.[0];
        const profilePicture = files?.profilepicture?.[0];

        const updatedcandidate = await candidateService.updateCandidateService(candidateId, req.body, {
            resume,
            profilePicture
        });

        if (!updatedcandidate) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: CANDIDATE_ERROR_MESSAGES.CANDIDATE_NOT_FOUND
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: CANDIDATE_SUCCESS_MESSAGES.CANDIDATE_UPDATED_SUCCESS_MESSAGE,
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
    } catch (error: any) {
        console.error(`Error in updating candidate profile: ${error} `);

        if (error.message === 'CANDIDATE_NOT_FOUND') {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: CANDIDATE_ERROR_MESSAGES.CANDIDATE_NOT_FOUND
            });
        }

        if (error.message === 'RESUME_UPLOAD_FAILED') {
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: CANDIDATE_ERROR_MESSAGES.RESUME_UPLOAD_FAILED
            });
        }

        if (error.message === 'PROFILE_PICTURE_UPLOAD_FAILED') {
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: CANDIDATE_ERROR_MESSAGES.PROFILE_PICTURE_UPLOAD_FAILED
            });
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CANDIDATE_ERROR_MESSAGES.CANDIDATE_PROFILE_UPDATE_FAILED
        });
    }
};

const applyToJob = async (req: Request, res: Response): Promise<Response> => {
    try {
        const candidateId = req.user?.candidateId as string;
        const { jobId } = req.body;

        const candidateJob = await candidateService.applyToJob(candidateId, jobId);

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: CANDIDATE_SUCCESS_MESSAGES.JOB_APPLIED_SUCCESS,
            data: {
                id: candidateJob.id,
                jobId: candidateJob.jobId,
                candidateId: candidateJob.candidateId,
                isJobApplied: candidateJob.isJobApplied,
                appliedAt: candidateJob.appliedAt
            }
        });
    } catch (error: any) {
        const errorConfig = ERROR_MAPPING[error.message];

        if (errorConfig) {
            return res.status(errorConfig.status).json({
                success: false,
                message: errorConfig.message
            });
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CANDIDATE_ERROR_MESSAGES.JOB_APPLY_FAILED
        });
    }
};

const saveJob = async (req: Request, res: Response): Promise<Response> => {
    try {
        const candidateId = req.user?.candidateId as string;
        const { jobId } = req.body;

        const candidateJob = await candidateService.saveJob(candidateId, jobId);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: CANDIDATE_SUCCESS_MESSAGES.JOB_SAVED_SUCCESS,
            data: {
                id: candidateJob.id,
                jobId: candidateJob.jobId,
                candidateId: candidateJob.candidateId,
                isJobSaved: candidateJob.isJobSaved,
                savedAt: candidateJob.savedAt
            }
        });
    } catch (error: any) {
        const errorConfig = ERROR_MAPPING[error.message];

        if (errorConfig) {
            return res.status(errorConfig.status).json({
                success: false,
                message: errorConfig.message
            });
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CANDIDATE_ERROR_MESSAGES.JOB_SAVE_FAILED
        });
    }
};

const unsaveJob = async (req: Request, res: Response): Promise<Response> => {
    try {
        const candidateId = req.user?.candidateId as string;
        const { jobId } = req.body;

        const candidateJob = await candidateService.unsaveJob(candidateId, jobId);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: CANDIDATE_SUCCESS_MESSAGES.JOB_UNSAVED_SUCCESS,
            data: {
                id: candidateJob.id,
                jobId: candidateJob.jobId,
                candidateId: candidateJob.candidateId,
                isJobSaved: candidateJob.isJobSaved
            }
        });
    } catch (error: any) {
        const errorConfig = ERROR_MAPPING[error.message];

        if (errorConfig) {
            return res.status(errorConfig.status).json({
                success: false,
                message: errorConfig.message
            });
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CANDIDATE_ERROR_MESSAGES.JOB_UNSAVE_FAILED
        });
    }
};

const getMyJobs = async (req: Request, res: Response): Promise<Response> => {
    try {
        const candidateId = req.user?.candidateId as string;

        const myJobs = await candidateService.getMyJobs(candidateId);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: CANDIDATE_SUCCESS_MESSAGES.MY_JOBS_FETCHED_SUCCESS,
            data: myJobs
        });
    } catch (error: any) {
        console.error(`Error in fetching my jobs: `, error);

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CANDIDATE_ERROR_MESSAGES.MY_JOBS_FETCH_FAILED
        });
    }
};

export default { candidateJoin, validateOTP, getCandidateById, getAllCandidates, getAllJobsByCandidate, updateCandidateProfile, applyToJob, saveJob, unsaveJob, getMyJobs };
