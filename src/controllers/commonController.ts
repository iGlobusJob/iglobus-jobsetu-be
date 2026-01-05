import { Request, Response } from 'express';
import commonService from '../services/commonServices';
import { HTTP_STATUS, COMMON_SUCCESS_MESSAGES, COMMON_ERROR_MESSAGES } from '../constants/commonMessages';

const getAllCandidates = async (req: Request, res: Response): Promise<Response> => {
    try {
        const candidateResponse = await commonService.getAllCandidates();
        return res.status(HTTP_STATUS.OK).json(candidateResponse);
    } catch (error) {
        console.error(`Error in fetching all candidates: ${error}`);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: COMMON_ERROR_MESSAGES.CANDIDATES_FETCH_FAILED
        });
    }
};

const getCandidateById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { candidateID } = req.params;
        const candidateResponse = await commonService.getCandidateById(candidateID);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: COMMON_SUCCESS_MESSAGES.CANDIDATE_FETCH_SUCCESS_MESSAGE,
            data: candidateResponse.data
        });
    } catch (error: any) {
        console.error(`Error in fetching candidate details: ${error}`);

        if (error.message === 'CANDIDATE_NOT_FOUND') {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: COMMON_ERROR_MESSAGES.CANDIDATE_NOT_FOUND
            });
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: COMMON_ERROR_MESSAGES.CANDIDATE_FETCH_FAILED
        });
    }
};

const getJobById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { jobId } = req.params;
        const job = await commonService.getJobById(jobId);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: COMMON_SUCCESS_MESSAGES.JOB_FETCH_SUCCESS_MESSAGE,
            data: job
        });
    } catch (error: any) {
        console.error(`Error in fetching job details: ${error}`);

        if (error.message === 'JOB_NOT_FOUND') {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: COMMON_ERROR_MESSAGES.JOB_NOT_FOUND
            });
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: COMMON_ERROR_MESSAGES.JOB_FETCH_FAILED
        });
    }
};

const getAllJobs = async (req: Request, res: Response) => {
    try {
        const allJobsResponse = await commonService.getAllJobs();
        return res.status(HTTP_STATUS.OK).json(allJobsResponse);

    } catch (error) {
        console.error(`Error in fetching all jobs : ${error}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: COMMON_ERROR_MESSAGES.JOBS_FETCH_FAILED });
    };
};

const sendContactUsMail = async (req: Request, res: Response): Promise<any> => {
    try {
        const mailDetailsToFire = req.body;
        const emailResponse = await commonService.sendContactUsMail(mailDetailsToFire);
        
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: COMMON_SUCCESS_MESSAGES.EMAIL_SEND_SUCCESS
        });
    } catch (error) {
        console.error(`Error in sending contact us mail: ${error}`);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: COMMON_ERROR_MESSAGES.EMAIL_SEND_FAILED
        });
    }
};
export default { getAllCandidates, getCandidateById, getJobById, getAllJobs, sendContactUsMail };
