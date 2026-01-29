import adminModel from '../model/adminModel';
import bcrypt from 'bcrypt';
import jwtUtil from '../util/jwtUtil';
import IAdmin, { FetchAllClientsResponse, FetchAllRecruitersResponse, DeleteRecruiterResponse } from '../interfaces/admin';
import clientModel from '../model/clientModel';
import IClient from '../interfaces/client';
import hashPasswordUtility from '../util/hashPassword';
import candidateModel from '../model/candidateModel';
import ICandidate from '../interfaces/candidate';
import recruiterModel from '../model/recruiterModel';
import IRecruiter from '../interfaces/recruiter';
import { FetchAllJobsResponse } from '../interfaces/jobs';
import jobsModel from '../model/jobsModel';

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

        // Sort clients: registered first, then inactive, then active
        const statusOrder: Record<string, number> = {
            'registered': 1,
            'inactive': 2,
            'active': 3
        };
        const sortedClients = formattedClients.sort((a, b) => {
            const statusA = a.status ?? 'active';
            const statusB = b.status ?? 'active';

            const statusDiff = (statusOrder[statusA] ?? 4) - (statusOrder[statusB] ?? 4);
            if (statusDiff !== 0) {
                return statusDiff;
            }

            const dateA = new Date(a.updatedAt ?? 0).getTime();
            const dateB = new Date(b.updatedAt ?? 0).getTime();
            return dateB - dateA;
        });

        return {
            success: true,
            clients: sortedClients
        };
    } catch (error) {
        throw new Error('Failed to fetch clients');
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
        password: hashedPassword,
        isDeleted: false
    });

    return recruiter;
};

const getAllRecruitersService = async (): Promise<FetchAllRecruitersResponse> => {
    try {
        const recruiters = await recruiterModel.find({ isDeleted: false }).sort({ createdAt: -1 });

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
        throw new Error('Failed to fetch recruiters');
    }
};

const deleteRecruiterByAdminService = async (recruiterId: string): Promise<DeleteRecruiterResponse> => {
    const deletedRecruiter = await recruiterModel.findByIdAndUpdate(
        recruiterId,
        { isDeleted: true },
        { new: true }
    );

    if (!deletedRecruiter) {
        throw new Error('RECRUITER_NOT_FOUND');
    }

    return {
        success: true,
    };
};

const getAllJobsByAdminService = async (): Promise<FetchAllJobsResponse> => {
    try {
        const now = new Date();
        const jobs = await jobsModel.find({ postStart: { $lte: now } }).populate({
            path: 'clientId',
            select: 'organizationName primaryContact logo'
        });

        const alljobs = jobs.map(job => {
            const client = job.clientId as any;
            return {
                id: job.id,
                clientId: client?._id || job.clientId,
                organizationName: client?.organizationName || '',
                primaryContactFirstName: client?.primaryContact?.firstName || '',
                primaryContactLastName: client?.primaryContact?.lastName || '',
                logo: client?.logo || '',
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
                updatedAt: job.updatedAt
            };
        });

        return {
            success: true,
            jobs: alljobs
        };
    } catch (error) {
        throw new Error(`Failed to fetch all jobs: ${error}`);
    };

};


export default { adminLogin, createAdminService, updateClientByAdmin, getClientById, getCandidateDetailsByService, getAllClientsService, createRecruiterService, getAllRecruitersService, deleteRecruiterByAdminService, getAllJobsByAdminService };
