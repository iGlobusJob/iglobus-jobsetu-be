import { Request, Response } from 'express';
import clientService from '../services/clientServices';
import { CLIENT_SUCCESS_MESSAGES, CLIENT_ERROR_MESSAGES, HTTP_STATUS, CLIENT_LOGIN_ERROR_MAPPING } from '../constants/clientMessages';

const DUPLICATE_KEY_ERROR_CODE = 11000;

const clientRegistration = async (req: Request, res: Response): Promise<Response> => {
    try {
        const file = req.file;
        const client = await clientService.clientRegistration(req.body, file);

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: CLIENT_SUCCESS_MESSAGES.CLIENT_ADD_SUCCESS_MESSAGE,
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
    } catch (error: any) {
        if (error.code === DUPLICATE_KEY_ERROR_CODE) {
            return res.status(HTTP_STATUS.CONFLICT).json({
                success: false,
                message: CLIENT_ERROR_MESSAGES.CLIENT_ADD_ERROR_MESSAGE
            });
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CLIENT_ERROR_MESSAGES.REGISTRATION_FAILED
        });
    }
};

const clientLogin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        const { client, token } = await clientService.clientLogin(email, password);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: CLIENT_SUCCESS_MESSAGES.CLIENT_LOGIN_SUCCESS_MESSAGE,
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
    } catch (error: any) {
        // Handle specific error cases using error mapping
        const errorMapping = CLIENT_LOGIN_ERROR_MAPPING[error.message];

        if (errorMapping) {
            return res.status(errorMapping.status).json({
                success: false,
                message: errorMapping.message
            });
        }

        // Generic error response
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CLIENT_ERROR_MESSAGES.LOGIN_FAILED
        });
    }
};

const getClientById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const clientId = req.user?.clientId as string;

        const client = await clientService.getClientById(clientId as string);

        if (!client) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: CLIENT_ERROR_MESSAGES.CLIENT_NOT_FOUND
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: CLIENT_SUCCESS_MESSAGES.CLIENT_FETCH_SUCCESS_MESSAGE,
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
    } catch (error: any) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CLIENT_ERROR_MESSAGES.FETCH_FAILED
        });
    }
};

const createJobByClient = async (req: Request, res: Response): Promise<Response> => {
    try {
        const clientId = req.user?.clientId as string;
        const jobData = req.body;

        const job = await clientService.createJobByClient(clientId, jobData);

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: CLIENT_SUCCESS_MESSAGES.JOB_CREATED_SUCCESS_MESSAGE
        });
    } catch (error: any) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CLIENT_ERROR_MESSAGES.JOB_CREATION_FAILED
        });
    }
};

const updateJobByClient = async (req: Request, res: Response): Promise<Response> => {
    try {
        const clientId = req.user?.clientId as string;
        const { jobId, ...jobData } = req.body;

        const updatedJob = await clientService.updateJobByClient(clientId, jobId, jobData);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: CLIENT_SUCCESS_MESSAGES.JOB_UPDATED_SUCCESS_MESSAGE,
            data: {
                jobId: updatedJob?.id,
                clientId: updatedJob?.clientId,
                jobTitle: updatedJob?.jobTitle,
                jobDescription: updatedJob?.jobDescription,
                postStart: updatedJob?.postStart,
                postEnd: updatedJob?.postEnd,
                noOfPositions: updatedJob?.noOfPositions,
                minimumSalary: updatedJob?.minimumSalary,
                maximumSalary: updatedJob?.maximumSalary,
                jobType: updatedJob?.jobType,
                jobLocation: updatedJob?.jobLocation,
                minimumExperience: updatedJob?.minimumExperience,
                maximumExperience: updatedJob?.maximumExperience,
                status: updatedJob?.status,
                createdAt: updatedJob?.createdAt,
                updatedAt: updatedJob?.updatedAt
            }
        });
    } catch (error: any) {
        if (error.message === 'JOB_NOT_FOUND_OR_UNAUTHORIZED') {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: CLIENT_ERROR_MESSAGES.JOB_NOT_FOUND_OR_UNAUTHORIZED
            });
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CLIENT_ERROR_MESSAGES.JOB_UPDATE_FAILED
        });
    }
};

const deleteJobByClient = async (req: Request, res: Response) => {
    try {
        const jobId = req.params.jobId;
        const clientId = req.user?.clientId as string;

        const deleteCandidateJobResponse = await clientService.deleteJob(jobId, clientId);

        if (!deleteCandidateJobResponse.success) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: CLIENT_ERROR_MESSAGES.JOB_NOT_FOUND
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: CLIENT_SUCCESS_MESSAGES.JOB_DELETED_SUCCESS_MESSAGE
        });

    } catch (error: any) {
        console.error(`Error in deleting job: `, error);

        return res.status(500).json({
            success: false,
            message: CLIENT_ERROR_MESSAGES.JOB_DELETE_ERROR_MESSAGE
        });
    }
};

const getAllJobsByClient = async (req: Request, res: Response): Promise<Response> => {
    try {
        const clientId = req.user?.clientId as string;

        const jobs = await clientService.getAllJobsByClient(clientId);

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

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: CLIENT_SUCCESS_MESSAGES.JOBS_FETCHED_SUCCESS_MESSAGE,
            data: formattedJobs
        });
    } catch (error: any) {
        console.error(`Error in fetching jobs: `, error);

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CLIENT_ERROR_MESSAGES.JOBS_FETCH_FAILED
        });
    }
};

const updateClientProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const clientId = req.user?.clientId;

        if (!clientId) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: 'Client ID not found in token'
            });
        }

        const file = req.file;
        const updatedClient = await clientService.updateClientProfile(clientId, req.body, file);

        if (!updatedClient) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: CLIENT_ERROR_MESSAGES.CLIENT_NOT_FOUND
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: CLIENT_SUCCESS_MESSAGES.CLIENT_PROFILE_UPDATED_SUCCESS_MESSAGE,
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
    } catch (error: any) {
        console.error(`Error in updating client profile: `, error);

        if (error.message === 'CLIENT_NOT_FOUND') {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: CLIENT_ERROR_MESSAGES.CLIENT_NOT_FOUND
            });
        }

        if (error.message === 'LOGO_UPLOAD_FAILED') {
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: CLIENT_ERROR_MESSAGES.LOGO_UPLOAD_FAILED
            });
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CLIENT_ERROR_MESSAGES.CLIENT_PROFILE_UPDATE_FAILED
        });
    }
};

const getJobByClient = async (req: Request, res: Response): Promise<Response> => {
    try {
        const clientId = req.user?.clientId as string;
        const { jobId } = req.params;

        const job = await clientService.getJobByClient(clientId, jobId);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: CLIENT_SUCCESS_MESSAGES.JOB_FETCH_SUCCESS_MESSAGE,
            data: job
        });
    } catch (error: any) {
        console.error(`Error in fetching job by client: ${error}`);

        if (error.message === 'JOB_NOT_FOUND_OR_UNAUTHORIZED') {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: CLIENT_ERROR_MESSAGES.JOB_NOT_FOUND_OR_UNAUTHORIZED
            });
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: CLIENT_ERROR_MESSAGES.JOBS_FETCH_FAILED
        });
    }
};


export default { clientRegistration, clientLogin, getClientById, createJobByClient, updateJobByClient, deleteJobByClient, getAllJobsByClient, updateClientProfile, getJobByClient };
