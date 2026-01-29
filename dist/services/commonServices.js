"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const candidateModel_1 = __importDefault(require("../model/candidateModel"));
const jobsModel_1 = __importDefault(require("../model/jobsModel"));
const candidateJobModel_1 = __importDefault(require("../model/candidateJobModel"));
const generatePresignedUrl_1 = __importDefault(require("../util/generatePresignedUrl"));
const sendContactUsEmail_1 = __importDefault(require("../util/sendContactUsEmail"));
const getAllCandidates = async () => {
    try {
        const candidates = await candidateModel_1.default.find().sort({ createdAt: -1 });
        const formattedCandidates = await Promise.all(candidates.map(async (candidate) => {
            let profileUrl = null;
            if (candidate.profile) {
                profileUrl = await generatePresignedUrl_1.default.generatePresignedUrl(candidate.profile);
            }
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
                profileUrl: profileUrl || '',
                profilePicture: profilePictureUrl || '',
                experience: candidate.experience || '',
                designation: candidate.designation || '',
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
        throw new Error('Failed to fetch candidate details');
    }
};
const getCandidateById = async (id) => {
    const candidate = await candidateModel_1.default.findById(id);
    if (!candidate) {
        throw new Error('CANDIDATE_NOT_FOUND');
    }
    let profileUrl = null;
    if (candidate.profile) {
        profileUrl = await generatePresignedUrl_1.default.generatePresignedUrl(candidate.profile);
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
            profileUrl: profileUrl || '',
            profilePicture: profilePictureUrl || '',
            category: candidate.category || '',
            designation: candidate.designation || '',
            experience: candidate.experience || '',
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
            select: 'organizationName primaryContact logo status'
        });
        const activeClientJobs = jobs.filter(job => {
            const client = job.clientId;
            return (client === null || client === void 0 ? void 0 : client.status) === 'active' && job.status === 'active';
        });
        const sortedJobs = activeClientJobs.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });
        const alljobs = sortedJobs.map(job => {
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
const sendContactUsMail = async (mailDetailsToFire) => {
    try {
        // Send email to admin
        await sendContactUsEmail_1.default.sendContactUsMail(mailDetailsToFire);
        // Send thank you email to customer
        await sendContactUsEmail_1.default.sendThankYouEmailToCustomer(mailDetailsToFire);
    }
    catch (error) {
        console.error(`Error in sending Email at services: ${error}`);
        return error;
    }
};
const getAllJobsByClient = async (clientId) => {
    const jobs = await jobsModel_1.default.find({ clientId }).sort({ createdAt: -1 });
    return jobs;
};
const getJobWithApplicants = async (jobId) => {
    var _a, _b;
    const job = await jobsModel_1.default.findById(jobId).populate({
        path: 'clientId',
        select: 'organizationName primaryContact logo'
    });
    if (!job) {
        throw new Error('JOB_NOT_FOUND');
    }
    // Get all candidates who applied for this job
    const candidateJobs = await candidateJobModel_1.default.find({ jobId, isJobApplied: true }).populate({
        path: 'candidateId',
        select: 'email firstName lastName mobileNumber address dateOfBirth gender category profile profilePicture designation experience createdAt updatedAt'
    });
    const applicants = await Promise.all(candidateJobs.map(async (candidateJob) => {
        const candidate = candidateJob.candidateId;
        if (!candidate)
            return null;
        return {
            id: candidate._id,
            email: candidate.email || '',
            firstName: candidate.firstName || '',
            lastName: candidate.lastName || '',
            mobileNumber: candidate.mobileNumber || '',
            designation: candidate.designation || '',
            experience: candidate.experience || '',
            appliedAt: candidateJob.appliedAt
        };
    }));
    const filteredApplicants = applicants.filter(applicant => applicant !== null);
    // Sort applicants by appliedAt in descending order (latest first)
    const sortedApplicants = filteredApplicants.sort((a, b) => {
        const dateA = (a === null || a === void 0 ? void 0 : a.appliedAt) ? new Date(a.appliedAt).getTime() : 0;
        const dateB = (b === null || b === void 0 ? void 0 : b.appliedAt) ? new Date(b.appliedAt).getTime() : 0;
        return dateB - dateA;
    });
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
        updatedAt: job.updatedAt,
        applicants: sortedApplicants,
        totalApplicants: sortedApplicants.length
    };
};
const getCandidateJobs = async (candidateId) => {
    const myJobs = await candidateJobModel_1.default.find({ candidateId })
        .populate({
        path: 'jobId',
        populate: {
            path: 'clientId',
            select: 'organizationName logo'
        }
    })
        .sort({ createdAt: -1 });
    return myJobs;
};
exports.default = { getAllCandidates, getCandidateById, getJobById, getAllJobs, sendContactUsMail, getAllJobsByClient, getJobWithApplicants, getCandidateJobs };
