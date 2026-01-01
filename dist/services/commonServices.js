"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const candidateModel_1 = __importDefault(require("../model/candidateModel"));
const jobsModel_1 = __importDefault(require("../model/jobsModel"));
const generatePresignedUrl_1 = __importDefault(require("../util/generatePresignedUrl"));
const getAllCandidates = async () => {
    try {
        const candidates = await candidateModel_1.default.find();
        const formattedCandidates = await Promise.all(candidates.map(async (candidate) => {
            let profilePictureUrl = null;
            if (candidate.profilePicture) {
                profilePictureUrl = await generatePresignedUrl_1.default.generatePresignedUrl(candidate.profilePicture);
            }
            return {
                id: candidate.id,
                email: candidate.email || '',
                firstName: candidate.firstName || '',
                lastName: candidate.lastName || '',
                mobileNumber: candidate.mobileNumber || '',
                address: candidate.address || '',
                dateOfBirth: candidate.dateOfBirth || '',
                gender: candidate.gender || '',
                category: candidate.category || '',
                profile: candidate.profile || '',
                profilePicture: profilePictureUrl || '',
                createdAt: candidate.createdAt,
                updatedAt: candidate.updatedAt
            };
        }));
        return {
            success: true,
            candidates: formattedCandidates
        };
    }
    catch (error) {
        throw new Error("Failed to fetch candidate details");
    }
};
const getCandidateById = async (id) => {
    const candidate = await candidateModel_1.default.findById(id);
    if (!candidate) {
        throw new Error('CANDIDATE_NOT_FOUND');
    }
    let profilePictureUrl = null;
    if (candidate.profilePicture) {
        profilePictureUrl = await generatePresignedUrl_1.default.generatePresignedUrl(candidate.profilePicture);
    }
    return {
        success: true,
        data: {
            id: candidate.id,
            email: candidate.email,
            firstName: candidate.firstName || '',
            lastName: candidate.lastName || '',
            mobileNumber: candidate.mobileNumber || '',
            address: candidate.address || '',
            dateOfBirth: candidate.dateOfBirth || '',
            gender: candidate.gender || '',
            profile: candidate.profile || '',
            profilePicture: profilePictureUrl || '',
            category: candidate.category || '',
            createdAt: candidate.createdAt,
            updatedAt: candidate.updatedAt
        }
    };
};
const getJobById = async (id) => {
    var _a, _b;
    const job = await jobsModel_1.default.findById(id).populate({
        path: 'clientId',
        select: 'organizationName primaryContact logo'
    });
    if (!job) {
        throw new Error('JOB_NOT_FOUND');
    }
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
};
const getAllJobs = async () => {
    try {
        const now = new Date();
        const jobs = await jobsModel_1.default.find({ postStart: { $lte: now } }).populate({
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
            jobs: alljobs
        };
    }
    catch (error) {
        throw new Error(`Failed to fetch all jobs: ${error}`);
    }
    ;
};
exports.default = { getAllCandidates, getCandidateById, getJobById, getAllJobs };
