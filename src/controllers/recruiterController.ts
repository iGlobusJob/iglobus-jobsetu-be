import { Request, Response } from 'express';
import {
  RECRUITER_SUCCESS_MESSAGE,
  RECRUITER_ERROR_MESSAGES,
  HTTP_STATUS,
  ERROR_MAPPING,
} from '../constants/recruiterMessages';
import recruiterService from '../services/recruiterServices';


const recruiterLogin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const { recruiter, token } = await recruiterService.recruiterLogin(
      email,
      password
    );

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: RECRUITER_SUCCESS_MESSAGE.RECRUITER_LOGIN_SUCCESS_MESSAGE,
      firstName:recruiter.firstName,
      lastName:recruiter.lastName,
      email:recruiter.email,
      token,
    });
  } catch (error: any) {
    const errorConfig = ERROR_MAPPING[error.message];

    if (errorConfig) {
      return res.status(errorConfig.status).json({
        success: false,
        message: errorConfig.message,
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: RECRUITER_ERROR_MESSAGES.LOGIN_FAILED,
    });
  }
};

const getAllJobsByRecruiter = async (req: Request, res: Response) => {
  try {
    const jobsResponse = await recruiterService.getAllJobsService();
    return res.status(HTTP_STATUS.OK).json(jobsResponse);
  } catch (error) {
    console.error(`Error fetching jobs by Recruiter: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: RECRUITER_ERROR_MESSAGES.RECRUITER_FETCH_JOBS_FAILED,
    });
  }
};

const getJobByIdByRecruiter = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { jobId } = req.params;

    const job = await recruiterService.getJobByIdService(jobId);

    if (!job) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: RECRUITER_ERROR_MESSAGES.JOB_NOT_FOUND,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error(`Error fetching job by ID: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: RECRUITER_ERROR_MESSAGES.JOB_FETCH_FAILED,
    });
  }
};

const getAllClientsByRecruiter = async (req: Request, res: Response) => {
  try {
    const clientsResponse =
      await recruiterService.getAllClientsService();
    return res.status(HTTP_STATUS.OK).json(clientsResponse);
  } catch (error) {
    console.error(`Error fetching clients by Recruiter: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: RECRUITER_ERROR_MESSAGES.CLIENTS_FETCH_ERROR_MESSAGE,
    });
  }
};

const getClientByIdByRecruiter = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { clientId } = req.params;

    const client = await recruiterService.getClientByIdService(clientId);

    if (!client) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: RECRUITER_ERROR_MESSAGES.CLIENT_NOT_FOUND,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error(`Error fetching client by ID: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: RECRUITER_ERROR_MESSAGES.CLIENT_FETCH_FAILED,
    });
  }
};

const getAllCandidatesByRecruiter = async (req: Request, res: Response) => {
  try {
    const candidatesResponse =
      await recruiterService.getAllCandidatesService();

    return res.status(HTTP_STATUS.OK).json(candidatesResponse);
  } catch (error) {
    console.error(`Error fetching candidates by Recruiter: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: RECRUITER_ERROR_MESSAGES.CANDIDATE_FETCH_FAILED,
    });
  }
};

const getCandidateByIdByRecruiter = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { candidateId } = req.params;

    const candidate =
      await recruiterService.getCandidateByIdService(candidateId);

    if (!candidate) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: RECRUITER_ERROR_MESSAGES.CANDIDATE_NOT_FOUND,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    console.error(`Error fetching candidate by ID: ${error}`);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: RECRUITER_ERROR_MESSAGES.CANDIDATE_FETCH_FAILED,
    });
  }
};

export default {
  recruiterLogin,
  getAllJobsByRecruiter,
  getJobByIdByRecruiter,
  getAllClientsByRecruiter,
  getClientByIdByRecruiter,
  getAllCandidatesByRecruiter,
  getCandidateByIdByRecruiter,
};
