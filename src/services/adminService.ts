import adminModel from '../model/adminModel';
import bcrypt from 'bcrypt';
import jwtUtil from '../util/jwtUtil';
import IAdmin, { FetchAllClientsResponse, FetchAllRecruitersResponse } from '../interfaces/admin';
import clientModel from '../model/clientModel';
import IClient from '../interfaces/client';
import hashPasswordUtility from '../util/hashPassword';
import candidateModel from '../model/candidateModel';
import ICandidate from '../interfaces/candidate';
import recruiterModel from '../model/recruiterModel';
import IRecruiter from '../interfaces/recruiter';

const adminLogin = async (username: string, password: string): Promise<{ admin: IAdmin; token: string }> => {
    const admin = await adminModel.findOne({ username }).select('+password');

    if (!admin) {
        throw new Error('ADMIN_NOT_FOUND');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
        throw new Error('BAD_CREDENTIALS');
    }

    const token = jwtUtil.generateToken({
        adminId: admin.id,
        username: admin.username,
        role: admin.role
    });

    return { admin, token };
};

const updateClientByAdmin = async (clientId: string, updateData: Partial<IClient>): Promise<IClient> => {
    const { email, ...allowedUpdateData } = updateData as any;

    if (allowedUpdateData.password) {
        allowedUpdateData.password = await hashPasswordUtility.hashPassword(allowedUpdateData.password);
    }

    const updatedClient = await clientModel.findByIdAndUpdate(
        clientId,
        { $set: allowedUpdateData },
        { new: true, runValidators: true }
    );

    if (!updatedClient) {
        throw new Error('CLIENT_NOT_FOUND');
    }

    return updatedClient;
};

const getClientById = async (clientId: string): Promise<IClient | null> => {
    const client = await clientModel.findById(clientId);
    return client;
};

const getCandidateDetailsByService = async (candidateId: string): Promise<ICandidate | null> => {
    const candidate = await candidateModel.findById(candidateId);
    return candidate;
};

const createAdminService = async (username: string, password: string, role: string): Promise<IAdmin> => {

    const existingAdmin = await adminModel.findOne({ username });

    if (existingAdmin) {
        throw new Error('ADMIN_ALREADY_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await adminModel.create({
        username,
        password: hashedPassword,
        role
    });

    return admin;
};

const getAllClientsService = async (): Promise<FetchAllClientsResponse> => {
    try {
        const clients = await clientModel.find();

        const formattedClients = clients.map(client => ({
            primaryContact: {
                firstName: client.primaryContact.firstName,
                lastName: client.primaryContact.lastName
            },
            organizationName: client.organizationName,
            logo: client.logo,
            email: client.email,
            status: client.status,
            emailStatus: client.emailStatus,
            mobile: client.mobile,
            mobileStatus: client.mobileStatus,
            category: client.category,
            gstin: client.gstin,
            panCard: client.panCard,
            id: client.id,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt
        }));

        return {
            success: true,
            clients: formattedClients
        };
    } catch (error) {
        throw new Error("Failed to fetch clients");
    };
};

const createRecruiterService = async (firstName: string, lastName: string, email: string, password: string): Promise<IRecruiter> => {
    // Check if recruiter already exists
    const existingRecruiter = await recruiterModel.findOne({ email });

    if (existingRecruiter) {
        throw new Error('RECRUITER_ALREADY_EXISTS');
    }

    // Hash the password
    const hashedPassword = await hashPasswordUtility.hashPassword(password);

    // Create recruiter
    const recruiter = await recruiterModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });

    return recruiter;
};

const getAllRecruitersService = async (): Promise<FetchAllRecruitersResponse> => {
    try {
        const recruiters = await recruiterModel.find();

        const formattedRecruiters = recruiters.map(recruiter => ({
            id: recruiter.id,
            firstName: recruiter.firstName,
            lastName: recruiter.lastName,
            email: recruiter.email,
            createdAt: recruiter.createdAt,
            updatedAt: recruiter.updatedAt
        }));

        return {
            success: true,
            recruiters: formattedRecruiters
        };
    } catch (error) {
        throw new Error("Failed to fetch recruiters");
    }
};

export default { adminLogin, createAdminService, updateClientByAdmin, getClientById, getCandidateDetailsByService, getAllClientsService, createRecruiterService, getAllRecruitersService };
