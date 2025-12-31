"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recruiterModel_1 = __importDefault(require("../model/recruiterModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtUtil_1 = __importDefault(require("../util/jwtUtil"));
const jobsModel_1 = __importDefault(require("../model/jobsModel"));
const clientModel_1 = __importDefault(require("../model/clientModel"));
const candidateModel_1 = __importDefault(require("../model/candidateModel"));
const generatePresignedUrl_1 = __importDefault(require("../util/generatePresignedUrl"));
const recruiterLogin = async (email, password) => {
    const recruiter = await recruiterModel_1.default
        .findOne({ email })
        .select('+password');
    if (!recruiter) {
        throw new Error('RECRUITER_NOT_FOUND');
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, recruiter.password);
    if (!isPasswordValid) {
        throw new Error('BAD_CREDENTIALS');
    }
    const token = jwtUtil_1.default.generateToken({
        recruiterId: recruiter.id,
        firstName: recruiter.firstName,
        lastName: recruiter.lastName,
        email: recruiter.email
    });
    return { recruiter, token };
};
const getAllJobsService = async () => {
    try {
        const jobs = await jobsModel_1.default.find().populate({
            path: 'clientId',
            select: 'organizationName primaryContact logo'
        });
        const alljobs = jobs.map(job => {
            var _a, _b;
            const client = job.clientId;
            return {
                id: job.id,
                clientId: (client === null || client === void 0 ? void 0 : client._id) || job.clientId,
                organizationName: (client === null || client === void 0 ? void 0 : client.organizationName) || '',
                primaryContactFirstName: ((_a = client === null || client === void 0 ? void 0 : client.primaryContact) === null || _a === void 0 ? void 0 : _a.firstName) || '',
                primaryContactLastName: ((_b = client === null || client === void 0 ? void 0 : client.primaryContact) === null || _b === void 0 ? void 0 : _b.lastName) || '',
                logo: (client === null || client === void 0 ? void 0 : client.logo) || '',
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
            jobs: alljobs,
        };
    }
    catch (error) {
        throw new Error('RECRUITER_FETCH_JOBS_FAILED');
    }
};
const getJobByIdService = async (jobId) => {
    const job = await jobsModel_1.default.findById(jobId);
    return job;
};
const getAllClientsService = async () => {
    try {
        const clients = await clientModel_1.default.find();
        const formattedClients = clients.map(client => ({
            id: client.id,
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
            primaryContact: client.primaryContact,
            secondaryContact: client.secondaryContact,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        }));
        return {
            success: true,
            clients: formattedClients,
        };
    }
    catch (error) {
        throw new Error('CLIENTS_FETCH_ERROR_MESSAGE');
    }
};
const getClientByIdService = async (clientId) => {
    return clientModel_1.default.findById(clientId);
};
const getAllCandidatesService = async () => {
    try {
        const candidates = await candidateModel_1.default.find();
        const formattedCandidates = await Promise.all(candidates.map(async (candidate) => {
            let profilePictureUrl = null;
            if (candidate.profilePicture) {
                profilePictureUrl = await generatePresignedUrl_1.default.generatePresignedUrl(candidate.profilePicture);
            }
            return {
                id: candidate.id,
                email: candidate.email,
                firstName: candidate.firstName || '',
                lastName: candidate.lastName || '',
                mobileNumber: candidate.mobileNumber || '',
                gender: candidate.gender || '',
                dateOfBirth: candidate.dateOfBirth || '',
                address: candidate.address || '',
                profilePicture: profilePictureUrl || '',
                category: candidate.category || '',
                createdAt: candidate.createdAt,
                updatedAt: candidate.updatedAt,
            };
        }));
        return {
            success: true,
            candidates: formattedCandidates,
        };
    }
    catch (error) {
        throw new Error('CANDIDATE_FETCH_FAILED');
    }
};
const getCandidateByIdService = async (candidateId) => {
    return candidateModel_1.default.findById(candidateId);
};
exports.default = {
    recruiterLogin,
    getAllJobsService,
    getJobByIdService,
    getAllClientsService,
    getClientByIdService,
    getAllCandidatesService,
    getCandidateByIdService,
};
