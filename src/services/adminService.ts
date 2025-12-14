import adminModel from '../model/adminModel';
import bcrypt from 'bcrypt';
import jwtUtil from '../util/jwtUtil';
import IAdmin, { FetchAllJobsResponse, FetchAllClientsResponse } from '../interfaces/admin';
import vendorModel from '../model/vendorModel';
import IVendor from '../interfaces/vendor';
import hashPasswordUtility from '../util/hashPassword';
import jobsModel from "../model/jobsModel";
import candidateModel from '../model/candidateModel';
import ICandidate from '../interfaces/candidate';

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

const updateVendorByAdmin = async (vendorId: string, updateData: Partial<IVendor>): Promise<IVendor> => {
    const { email, ...allowedUpdateData } = updateData as any;

    if (allowedUpdateData.password) {
        allowedUpdateData.password = await hashPasswordUtility.hashPassword(allowedUpdateData.password);
    }

    const updatedVendor = await vendorModel.findByIdAndUpdate(
        vendorId,
        { $set: allowedUpdateData },
        { new: true, runValidators: true }
    );

    if (!updatedVendor) {
        throw new Error('VENDOR_NOT_FOUND');
    }

    return updatedVendor;
};

const getAllJobsService = async (): Promise<FetchAllJobsResponse> => {
    try {
        const jobs = await jobsModel.find();
        const alljobs = jobs.map(job => ({
            id: job.id,
            vendorId: job.vendorId,
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
            updatedAt: job.updatedAt
        }));

        return {
            success: true,
            jobs: alljobs
        };
    } catch (error) {
        throw new Error("Failed to fetch all jobs ");
    };

};

const getVendorById = async (vendorId: string): Promise<IVendor | null> => {
    const vendor = await vendorModel.findById(vendorId);
    return vendor;
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
        const clients = await vendorModel.find();

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

export default { adminLogin, createAdminService, updateVendorByAdmin, getAllJobsService, getVendorById, getCandidateDetailsByService, getAllClientsService };
