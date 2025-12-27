"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const candidateModel_1 = __importDefault(require("../model/candidateModel"));
const jobsModel_1 = __importDefault(require("../model/jobsModel"));
const candidateJobModel_1 = __importDefault(require("../model/candidateJobModel"));
const jwtUtil_1 = __importDefault(require("../util/jwtUtil"));
const sendcandidateRegistrationOTPEmail_1 = __importDefault(require("../util/sendcandidateRegistrationOTPEmail"));
const uploadResumeToS3_1 = __importDefault(require("../util/uploadResumeToS3"));
const uploadProfilePictureToS3_1 = __importDefault(require("../util/uploadProfilePictureToS3"));
const generatePresignedUrl_1 = __importDefault(require("../util/generatePresignedUrl"));
const sendJobAppliedMail_1 = __importDefault(require("../util/sendJobAppliedMail "));
const generateOTP = () => {
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    return otp;
};
const candidateJoin = async (email) => {
    const otp = generateOTP();
    const otpExpiredAt = new Date();
    otpExpiredAt.setMinutes(otpExpiredAt.getMinutes() + 10);
    let candidate = await candidateModel_1.default.findOne({ email });
    if (candidate) {
        candidate.otp = otp;
        candidate.otpexpiredAt = otpExpiredAt;
        await candidate.save();
    }
    else {
        const newCandidate = new candidateModel_1.default({
            email,
            otp,
            otpexpiredAt: otpExpiredAt
        });
        candidate = await newCandidate.save();
    }
    sendcandidateRegistrationOTPEmail_1.default.sendOTPEmail(email, otp).catch(error => {
        console.error('Failed to send OTP email:', error);
    });
    return { candidate, otp };
};
const validateOTP = async (email, otp) => {
    const candidate = await candidateModel_1.default.findOne({ email });
    if (!candidate) {
        throw new Error('CANDIDATE_NOT_FOUND');
    }
    const currentTime = new Date();
    if (currentTime > candidate.otpexpiredAt) {
        throw new Error('OTP_EXPIRED');
    }
    if (candidate.otp !== otp) {
        throw new Error('INVALID_OTP');
    }
    const token = jwtUtil_1.default.generateToken({
        candidateId: candidate.id,
        email: candidate.email,
        role: 'candidate'
    });
    let profilePictureUrl = null;
    if (candidate.profilePicture) {
        profilePictureUrl = await generatePresignedUrl_1.default.generatePresignedUrl(candidate.profilePicture);
    }
    return { candidate, token, profilePictureUrl };
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
            category: candidate.category || '',
            profile: candidate.profile || '',
            profileUrl: profileUrl,
            profilePicture: candidate.profilePicture || '',
            profilePictureUrl: profilePictureUrl,
            createdAt: candidate.createdAt,
            updatedAt: candidate.updatedAt
        }
    };
};
const getAllCandidateService = async () => {
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
    ;
};
const getAllJobsByCandidate = async () => {
    try {
        const jobs = await jobsModel_1.default.find({ status: 'active' }).sort({ createdAt: -1 }).populate({
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
        throw new Error("Failed to fetch all jobs ");
    }
    ;
};
const updateCandidateService = async (candidateId, updateData, files) => {
    // Handle resume upload
    if (files === null || files === void 0 ? void 0 : files.resume) {
        const timestamp = Date.now();
        const fileName = `resume_${timestamp}_${files.resume.originalname}`;
        try {
            const uploadResult = await uploadResumeToS3_1.default.uploadResumeToS3(candidateId, fileName, files.resume.buffer, files.resume.mimetype);
            updateData.profile = uploadResult.fileUrl;
        }
        catch (error) {
            console.error('Error uploading resume to S3:', error);
            throw new Error('RESUME_UPLOAD_FAILED');
        }
    }
    // Handle profile picture upload
    if (files === null || files === void 0 ? void 0 : files.profilePicture) {
        const timestamp = Date.now();
        const fileName = `profilepicture_${timestamp}_${files.profilePicture.originalname}`;
        try {
            const uploadResult = await uploadProfilePictureToS3_1.default.uploadProfilePictureToS3(candidateId, fileName, files.profilePicture.buffer, files.profilePicture.mimetype);
            updateData.profilePicture = uploadResult.fileUrl;
        }
        catch (error) {
            console.error('Error uploading profile picture to S3:', error);
            throw new Error('PROFILE_PICTURE_UPLOAD_FAILED');
        }
    }
    const updatedCandidate = await candidateModel_1.default.findByIdAndUpdate(candidateId, { $set: updateData }, { new: true, runValidators: true });
    if (!updatedCandidate) {
        throw new Error('CANDIDATE_NOT_FOUND');
    }
    else {
        if (updatedCandidate.profilePicture) {
            const profileImage = await generatePresignedUrl_1.default.generatePresignedUrl(updatedCandidate.profilePicture);
            if (profileImage) {
                updatedCandidate.profilePicture = profileImage;
            }
        }
    }
    return updatedCandidate;
};
const applyToJob = async (candidateId, jobId) => {
    const job = await jobsModel_1.default.findById(jobId);
    if (!job) {
        throw new Error('JOB_NOT_FOUND');
    }
    const candidate = await candidateModel_1.default.findById(candidateId);
    if (!candidate) {
        throw new Error('CANDIDATE_NOT_FOUND');
    }
    let candidateJob = await candidateJobModel_1.default.findOne({ candidateId, jobId });
    if (candidateJob) {
        if (candidateJob.isJobApplied) {
            throw new Error('JOB_ALREADY_APPLIED');
        }
        candidateJob.isJobApplied = true;
        candidateJob.appliedAt = new Date();
        await candidateJob.save();
    }
    else {
        candidateJob = await candidateJobModel_1.default.create({
            candidateId,
            jobId,
            isJobApplied: true,
            appliedAt: new Date()
        });
    }
    // send email after applying the job
    (0, sendJobAppliedMail_1.default)(candidate.email, job.jobTitle).catch((error) => {
        console.error('Failed to send job applied email:', error);
    });
    return candidateJob;
};
const saveJob = async (candidateId, jobId) => {
    const job = await jobsModel_1.default.findById(jobId);
    if (!job) {
        throw new Error('JOB_NOT_FOUND');
    }
    const candidate = await candidateModel_1.default.findById(candidateId);
    if (!candidate) {
        throw new Error('CANDIDATE_NOT_FOUND');
    }
    let candidateJob = await candidateJobModel_1.default.findOne({ candidateId, jobId });
    if (candidateJob) {
        candidateJob.isJobSaved = true;
        candidateJob.savedAt = new Date();
        await candidateJob.save();
    }
    else {
        candidateJob = await candidateJobModel_1.default.create({
            candidateId,
            jobId,
            isJobSaved: true,
            savedAt: new Date()
        });
    }
    return candidateJob;
};
const unsaveJob = async (candidateId, jobId) => {
    const candidateJob = await candidateJobModel_1.default.findOne({ candidateId, jobId });
    if (!candidateJob || !candidateJob.isJobSaved) {
        throw new Error('JOB_NOT_SAVED');
    }
    candidateJob.isJobSaved = false;
    candidateJob.savedAt = undefined;
    await candidateJob.save();
    return candidateJob;
};
const getMyJobs = async (candidateId) => {
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
exports.default = { candidateJoin, validateOTP, getCandidateById, getAllCandidateService, getAllJobsByCandidate, updateCandidateService, applyToJob, saveJob, unsaveJob, getMyJobs };
