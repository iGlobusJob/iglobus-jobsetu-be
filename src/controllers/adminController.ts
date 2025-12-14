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

const updateVendorByAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { vendorId, ...updateData } = req.body;

        const updatedVendor = await adminService.updateVendorByAdmin(vendorId, updateData);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: ADMIN_SUCCESS_MESSAGE.VENDOR_UPDATED_SUCCESS_MESSAGE,
            data: {
                id: updatedVendor.id,
                email: updatedVendor.email,
                organizationName: updatedVendor.organizationName,
                status: updatedVendor.status,
                emailStatus: updatedVendor.emailStatus,
                mobile: updatedVendor.mobile,
                mobileStatus: updatedVendor.mobileStatus,
                location: updatedVendor.location,
                logo: updatedVendor.logo,
                gstin: updatedVendor.gstin,
                panCard: updatedVendor.panCard,
                category: updatedVendor.category,
                primaryContact: updatedVendor.primaryContact,
                secondaryContact: updatedVendor.secondaryContact,
                createdAt: updatedVendor.createdAt,
                updatedAt: updatedVendor.updatedAt
            }
        });
    } catch (error: any) {
        if (error.message === 'VENDOR_NOT_FOUND') {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: ADMIN_ERROR_MESSAGES.VENDOR_NOT_FOUND
            });
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: ADMIN_ERROR_MESSAGES.UPDATE_FAILED
        });
    }
};

const getAllJobsByAdmin = async (req: Request, res: Response) => {
    try {
        const allJobsResponse = await adminService.getAllJobsService();
        return res.status(HTTP_STATUS.OK).json(allJobsResponse);

    } catch (error) {
        console.error(`Error in fetching all jobs details by Admin: ${error}`);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: ADMIN_ERROR_MESSAGES.ADMIN_FETCH_JOBS_FAILED });
    };
};

const getVendorDetailsByAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { vendorid } = req.params;

        const vendor = await adminService.getVendorById(vendorid);

        if (!vendor) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: ADMIN_ERROR_MESSAGES.VENDOR_NOT_FOUND
            });
        }

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: ADMIN_SUCCESS_MESSAGE.VENDOR_DETAILS_FETCHED_SUCCESS_MESSAGE,
            data: {
                id: vendor.id,
                email: vendor.email,
                organizationName: vendor.organizationName,
                logo: vendor.logo,
                status: vendor.status,
                emailStatus: vendor.emailStatus,
                mobile: vendor.mobile,
                mobileStatus: vendor.mobileStatus,
                location: vendor.location,
                gstin: vendor.gstin,
                panCard: vendor.panCard,
                primaryContact: vendor.primaryContact,
                secondaryContact: vendor.secondaryContact,
                category: vendor.category,
                createdAt: vendor.createdAt,
                updatedAt: vendor.updatedAt
            }
        });
    } catch (error: any) {
        console.error(`Error in fetching vendor details by Admin: `, error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: ADMIN_ERROR_MESSAGES.VENDOR_FETCH_FAILED
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
                createdAt: candidate.createdAt,
                updatedAt: candidate.updatedAt

            }
        });
    } catch (error: any) {
        console.error(`Error in fetching candidate details by Admin: `, error);
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

export default { adminLogin, updateVendorByAdmin, getAllJobsByAdmin, getVendorDetailsByAdmin, getCandidateDetailsByAdmin, createAdmin, getAllClients };
