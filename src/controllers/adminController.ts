import { Request, Response } from 'express';
import { ADMIN_SUCCESS_MESSAGE, ADMIN_ERROR_MESSAGES, HTTP_STATUS, ERROR_MAPPING } from '../constants/adminMessages';
import adminService from '../services/adminService';

const adminLogin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, password } = req.body;
        const { admin, token } = await adminService.adminLogin(username, password);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: ADMIN_SUCCESS_MESSAGE.ADMIN_LOGIN_SUCCESS_MESSAGE,
            username: admin.username,
            role: admin.role,
            token
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
            message: ADMIN_ERROR_MESSAGES.LOGIN_FAILED
        });
    };
}

const createAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, password } = req.body;
        const role = 'admin';

        const admin = await adminService.createAdminService(username, password, role);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: ADMIN_SUCCESS_MESSAGE.ADMIN_CREATED_SUCCESS_MESSAGE,
            admin
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
            message: ADMIN_ERROR_MESSAGES.ADMIN_CREATION_FAILED
        });
    }
};

const updateClientByAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { clientId, ...updateData } = req.body;

        const updatedClient = await adminService.updateClientByAdmin(clientId, updateData);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: ADMIN_SUCCESS_MESSAGE.CLIENT_UPDATED_SUCCESS_MESSAGE,
            data: {
                id: updatedClient.id,
                email: updatedClient.email,
                organizationName: updatedClient.organizationName,
                status: updatedClient.status,
                emailStatus: updatedClient.emailStatus,
                mobile: updatedClient.mobile,
                mobileStatus: updatedClient.mobileStatus,
                location: updatedClient.location,
                logo: updatedClient.logo,
                gstin: updatedClient.gstin,
                panCard: updatedClient.panCard,
                category: updatedClient.category,
                primaryContact: updatedClient.primaryContact,
                secondaryContact: updatedClient.secondaryContact,
                createdAt: updatedClient.createdAt,
                updatedAt: updatedClient.updatedAt
            }
        });
    } catch (error: any) {
        if (error.message === 'CLIENT_NOT_FOUND') {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: ADMIN_ERROR_MESSAGES.CLIENT_NOT_FOUND
            });
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: ADMIN_ERROR_MESSAGES.CLIENT_UPDATE_FAILED
        });
    }
};

const getClientDetailsByAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { clientId } = req.params;
        const client = await adminService.getClientById(clientId);

        if (!client) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: ADMIN_ERROR_MESSAGES.CLIENT_NOT_FOUND
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: ADMIN_SUCCESS_MESSAGE.CLIENT_DETAILS_FETCHED_SUCCESS_MESSAGE,
            data: {
                id: client.id,
                email: client.email,
                organizationName: client.organizationName,
                logo: client.logo,
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
                createdAt: client.createdAt,
                updatedAt: client.updatedAt
            }
        });
    } catch (error: any) {
        console.error(`Error in fetching client details by Admin: ${error}`);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: ADMIN_ERROR_MESSAGES.CLIENT_FETCH_FAILED
        });
    }
};

const getCandidateDetailsByAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { candidateid } = req.params;
        const candidate = await adminService.getCandidateDetailsByService(candidateid);

        if (!candidate) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: ADMIN_ERROR_MESSAGES.CANDIDATE_NOT_FOUND
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: ADMIN_SUCCESS_MESSAGE.CANDIDATE_DETAILS_FETCHED_SUCCESS_MESSAGE,
            data: {
                id: candidate.id,
                email: candidate.email,
                firstName: candidate.firstName || '',
                lastName: candidate.lastName || '',
                mobileNumber: candidate.mobileNumber || '',
                address: candidate.address || '',
                dateOfBirth: candidate.dateOfBirth || '',
                gender: candidate.gender || '',
                category: candidate.category,
                profile: candidate.profile,
                profilePicture: candidate.profilePicture,
                designation: candidate.designation,
                experience: candidate.experience,
                createdAt: candidate.createdAt,
                updatedAt: candidate.updatedAt

            }
        });
    } catch (error: any) {
        console.error(`Error in fetching candidate details by Admin: ${error}`);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: ADMIN_ERROR_MESSAGES.CANDIDATE_FETCH_FAILED
        });
    }

};

const getAllClients = async (req: Request, res: Response) => {
    try {
        const clientsResponse = await adminService.getAllClientsService();
        return res.status(200).json(clientsResponse);

    } catch (error) {
        console.error(`Error in fetching client details: ${error}`);
        res.status(500).json({ success: false, message: ADMIN_ERROR_MESSAGES.CLIENTS_FETCH_ERROR_MESSAGE });
    };
};

const createRecruiter = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const recruiter = await adminService.createRecruiterService(firstName, lastName, email, password);

        return res.status(HTTP_STATUS.CREATED).json({
            success: true,
            message: ADMIN_SUCCESS_MESSAGE.RECRUITER_CREATED_SUCCESS_MESSAGE,
            data: {
                id: recruiter.id,
                firstName: recruiter.firstName,
                lastName: recruiter.lastName,
                email: recruiter.email,
                createdAt: recruiter.createdAt,
                updatedAt: recruiter.updatedAt
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
            message: ADMIN_ERROR_MESSAGES.RECRUITER_CREATION_FAILED
        });
    }
};

const getAllRecruiters = async (req: Request, res: Response) => {
    try {
        const recruitersResponse = await adminService.getAllRecruitersService();
        return res.status(HTTP_STATUS.OK).json(recruitersResponse);
    } catch (error) {
        console.error(`Error in fetching recruiters: ${error}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: ADMIN_ERROR_MESSAGES.RECRUITERS_FETCH_ERROR_MESSAGE
        });
    }
};

const deleteRecruiteByAdmin = async (req: Request, res: Response) => {
    try {
        const { recruiterId } = req.params;
        await adminService.deleteRecruiterByAdminService(recruiterId);
        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: ADMIN_SUCCESS_MESSAGE.RECRUITER_DELETED_SUCCESS_MESSAGE
        });
    } catch (error) {
        console.error(`Error in deleting recruiter: ${error}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: ADMIN_ERROR_MESSAGES.RECRUITER_DELETED_MESSAGE
        });
    }
}

const getAllJobsByAdmin = async (req: Request, res: Response) => {
    try {
        const allJobsResponse = await adminService.getAllJobsByAdminService();
        return res.status(HTTP_STATUS.OK).json(allJobsResponse);

    } catch (error) {
        console.error(`Error in fetching all jobs : ${error}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: ADMIN_ERROR_MESSAGES.JOBS_FETCH_FAILED });
    };
};

export default { adminLogin, updateClientByAdmin, getClientDetailsByAdmin, getCandidateDetailsByAdmin, createAdmin, getAllClients, createRecruiter, getAllRecruiters, deleteRecruiteByAdmin, getAllJobsByAdmin };
