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
const adminMessages_1 = require("../constants/adminMessages");
const adminService_1 = __importDefault(require("../services/adminService"));
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const { admin, token } = await adminService_1.default.adminLogin(username, password);
        return res.status(adminMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: adminMessages_1.ADMIN_SUCCESS_MESSAGE.ADMIN_LOGIN_SUCCESS_MESSAGE,
            username: admin.username,
            role: admin.role,
            token
        });
    }
    catch (error) {
        const errorConfig = adminMessages_1.ERROR_MAPPING[error.message];
        if (errorConfig) {
            return res.status(errorConfig.status).json({
                success: false,
                message: errorConfig.message
            });
        }
        return res.status(adminMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: adminMessages_1.ADMIN_ERROR_MESSAGES.LOGIN_FAILED
        });
    }
    ;
};
const createAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const role = 'admin';
        const admin = await adminService_1.default.createAdminService(username, password, role);
        return res.status(adminMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: adminMessages_1.ADMIN_SUCCESS_MESSAGE.ADMIN_CREATED_SUCCESS_MESSAGE,
            admin
        });
    }
    catch (error) {
        const errorConfig = adminMessages_1.ERROR_MAPPING[error.message];
        if (errorConfig) {
            return res.status(errorConfig.status).json({
                success: false,
                message: errorConfig.message
            });
        }
        return res.status(adminMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: adminMessages_1.ADMIN_ERROR_MESSAGES.ADMIN_CREATION_FAILED
        });
    }
};
const updateClientByAdmin = async (req, res) => {
    try {
        const _a = req.body, { clientId } = _a, updateData = __rest(_a, ["clientId"]);
        const updatedClient = await adminService_1.default.updateClientByAdmin(clientId, updateData);
        return res.status(adminMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: adminMessages_1.ADMIN_SUCCESS_MESSAGE.CLIENT_UPDATED_SUCCESS_MESSAGE,
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
    }
    catch (error) {
        if (error.message === 'CLIENT_NOT_FOUND') {
            return res.status(adminMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: adminMessages_1.ADMIN_ERROR_MESSAGES.CLIENT_NOT_FOUND
            });
        }
        return res.status(adminMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: adminMessages_1.ADMIN_ERROR_MESSAGES.CLIENT_UPDATE_FAILED
        });
    }
};
const getClientDetailsByAdmin = async (req, res) => {
    try {
        const { clientId } = req.params;
        const client = await adminService_1.default.getClientById(clientId);
        if (!client) {
            return res.status(adminMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: adminMessages_1.ADMIN_ERROR_MESSAGES.CLIENT_NOT_FOUND
            });
        }
        return res.status(adminMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: adminMessages_1.ADMIN_SUCCESS_MESSAGE.CLIENT_DETAILS_FETCHED_SUCCESS_MESSAGE,
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
    }
    catch (error) {
        console.error(`Error in fetching client details by Admin: `, error);
        return res.status(adminMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: adminMessages_1.ADMIN_ERROR_MESSAGES.CLIENT_FETCH_FAILED
        });
    }
};
const getCandidateDetailsByAdmin = async (req, res) => {
    try {
        const { candidateid } = req.params;
        const candidate = await adminService_1.default.getCandidateDetailsByService(candidateid);
        if (!candidate) {
            return res.status(adminMessages_1.HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: adminMessages_1.ADMIN_ERROR_MESSAGES.CANDIDATE_NOT_FOUND
            });
        }
        return res.status(adminMessages_1.HTTP_STATUS.OK).json({
            success: true,
            message: adminMessages_1.ADMIN_SUCCESS_MESSAGE.CANDIDATE_DETAILS_FETCHED_SUCCESS_MESSAGE,
            data: {
                id: candidate.id,
                email: candidate.email,
                firstName: candidate.firstName || '',
                lastName: candidate.lastName || '',
                mobileNumber: candidate.mobileNumber || '',
                address: candidate.address || '',
                dateOfBirth: candidate.dateOfBirth || '',
                gender: candidate.gender || '',
                profile: candidate.profile,
                profilePicture: candidate.profilePicture,
                createdAt: candidate.createdAt,
                updatedAt: candidate.updatedAt
            }
        });
    }
    catch (error) {
        console.error(`Error in fetching candidate details by Admin: `, error);
        return res.status(adminMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: adminMessages_1.ADMIN_ERROR_MESSAGES.CANDIDATE_FETCH_FAILED
        });
    }
};
const getAllClients = async (req, res) => {
    try {
        const clientsResponse = await adminService_1.default.getAllClientsService();
        return res.status(200).json(clientsResponse);
    }
    catch (error) {
        console.error(`Error in fetching client details: ${error}`);
        res.status(500).json({ success: false, message: adminMessages_1.ADMIN_ERROR_MESSAGES.CLIENTS_FETCH_ERROR_MESSAGE });
    }
    ;
};
const createRecruiter = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const recruiter = await adminService_1.default.createRecruiterService(firstName, lastName, email, password);
        return res.status(adminMessages_1.HTTP_STATUS.CREATED).json({
            success: true,
            message: adminMessages_1.ADMIN_SUCCESS_MESSAGE.RECRUITER_CREATED_SUCCESS_MESSAGE,
            data: {
                id: recruiter.id,
                firstName: recruiter.firstName,
                lastName: recruiter.lastName,
                email: recruiter.email,
                createdAt: recruiter.createdAt,
                updatedAt: recruiter.updatedAt
            }
        });
    }
    catch (error) {
        const errorConfig = adminMessages_1.ERROR_MAPPING[error.message];
        if (errorConfig) {
            return res.status(errorConfig.status).json({
                success: false,
                message: errorConfig.message
            });
        }
        return res.status(adminMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: adminMessages_1.ADMIN_ERROR_MESSAGES.RECRUITER_CREATION_FAILED
        });
    }
};
const getAllRecruiters = async (req, res) => {
    try {
        const recruitersResponse = await adminService_1.default.getAllRecruitersService();
        return res.status(adminMessages_1.HTTP_STATUS.OK).json(recruitersResponse);
    }
    catch (error) {
        console.error(`Error in fetching recruiters: ${error}`);
        res.status(adminMessages_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: adminMessages_1.ADMIN_ERROR_MESSAGES.RECRUITERS_FETCH_ERROR_MESSAGE
        });
    }
};
exports.default = { adminLogin, updateClientByAdmin, getClientDetailsByAdmin, getCandidateDetailsByAdmin, createAdmin, getAllClients, createRecruiter, getAllRecruiters };
