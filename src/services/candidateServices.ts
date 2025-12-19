import candidateModel from "../model/candidateModel";
import jobsModel from "../model/jobsModel";
import candidateJobModel from "../model/candidateJobModel";
import ICandidate, { FetchCandidateByIdResponse, FetchAllCandidateResponse } from "../interfaces/candidate";
import IJobs, { FetchAllJobsResponse } from "../interfaces/jobs";
import ICandidateJob from "../interfaces/candidateJob";
import jwtUtil from "../util/jwtUtil";
import sendOTPEmailUtil from "../util/sendcandidateRegistrationOTPEmail";
import uploadResumeUtil from "../util/uploadResumeToS3";
import uploadProfilePictureUtil from "../util/uploadProfilePictureToS3";
import presignedUrlUtil from "../util/generatePresignedUrl";
import candidateJobApplied from "../util/sendJobAppliedMail ";

const generateOTP = (): string => {
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    return otp;
};

const candidateJoin = async (email: string): Promise<{ candidate: ICandidate; otp: string }> => {
    const otp = generateOTP();

    const otpExpiredAt = new Date();
    otpExpiredAt.setMinutes(otpExpiredAt.getMinutes() + 10);

    let candidate = await candidateModel.findOne({ email });

    if (candidate) {
        candidate.otp = otp;
        candidate.otpexpiredAt = otpExpiredAt;
        await candidate.save();
    } else {
        const newCandidate = new candidateModel({
            email,
            otp,
            otpexpiredAt: otpExpiredAt
        });
        candidate = await newCandidate.save();
    }

    sendOTPEmailUtil.sendOTPEmail(email, otp).catch(error => {
        console.log('Failed to send OTP email:', error);
    });

    return { candidate, otp };
};

const validateOTP = async (email: string, otp: string): Promise<{ candidate: ICandidate; token: string; profilePictureUrl: string | null }> => {
    const candidate = await candidateModel.findOne({ email });

    if (!candidate) {
        throw new Error('CANDIDATE_NOT_FOUND');
    }

    const currentTime = new Date();
    if (currentTime > candidate.otpexpiredAt!) {
        throw new Error('OTP_EXPIRED');
    }

    if (candidate.otp !== otp) {
        throw new Error('INVALID_OTP');
    }

    const token = jwtUtil.generateToken({
        candidateId: candidate.id,
        email: candidate.email,
        role: 'candidate'
    });

    let profilePictureUrl: string | null = null;
    if (candidate.profilePicture) {
        profilePictureUrl = await presignedUrlUtil.generatePresignedUrl(candidate.profilePicture);
    }

    return { candidate, token, profilePictureUrl };
};
const getCandidateById = async (id: string): Promise<FetchCandidateByIdResponse> => {
    const candidate = await candidateModel.findById(id);

    if (!candidate) {
        throw new Error('CANDIDATE_NOT_FOUND');
    }

    let profileUrl: string | null = null;
    if (candidate.profile) {
        profileUrl = await presignedUrlUtil.generatePresignedUrl(candidate.profile);
    }

    let profilePictureUrl: string | null = null;
    if (candidate.profilePicture) {
        profilePictureUrl = await presignedUrlUtil.generatePresignedUrl(candidate.profilePicture);
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

const getAllCandidateService = async (): Promise<FetchAllCandidateResponse> => {
    try {
        const candidates = await candidateModel.find();

        const formattedCandidates = await Promise.all(candidates.map(async candidate => {
            let profilePictureUrl: string | null = null;
            if (candidate.profilePicture) {
                profilePictureUrl = await presignedUrlUtil.generatePresignedUrl(candidate.profilePicture);
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
    } catch (error) {
        throw new Error("Failed to fetch candidate details");
    };

};

const getAllJobsByCandidate = async (): Promise<FetchAllJobsResponse> => {
    try {
        const jobs = await jobsModel.find({ status: 'active' }).sort({ createdAt: -1 }).populate({
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
        throw new Error("Failed to fetch all jobs ");
    };

};

const updateCandidateService = async (
    candidateId: string,
    updateData: Partial<ICandidate>,
    files?: { resume?: Express.Multer.File; profilePicture?: Express.Multer.File }
): Promise<ICandidate> => {
    // Handle resume upload
    if (files?.resume) {
        const timestamp = Date.now();
        const fileName = `resume_${timestamp}_${files.resume.originalname}`;

        try {
            const uploadResult = await uploadResumeUtil.uploadResumeToS3(
                candidateId,
                fileName,
                files.resume.buffer,
                files.resume.mimetype
            );

            updateData.profile = uploadResult.fileUrl;
        } catch (error) {
            console.error('Error uploading resume to S3:', error);
            throw new Error('RESUME_UPLOAD_FAILED');
        }
    }

    // Handle profile picture upload
    if (files?.profilePicture) {
        const timestamp = Date.now();
        const fileName = `profilepicture_${timestamp}_${files.profilePicture.originalname}`;

        try {
            const uploadResult = await uploadProfilePictureUtil.uploadProfilePictureToS3(
                candidateId,
                fileName,
                files.profilePicture.buffer,
                files.profilePicture.mimetype
            );

            updateData.profilePicture = uploadResult.fileUrl;
        } catch (error) {
            console.error('Error uploading profile picture to S3:', error);
            throw new Error('PROFILE_PICTURE_UPLOAD_FAILED');
        }
    }

    const updatedCandidate = await candidateModel.findByIdAndUpdate(
        candidateId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
        throw new Error('CANDIDATE_NOT_FOUND');
    } else {
        if (updatedCandidate.profilePicture) {
            const profileImage = await presignedUrlUtil.generatePresignedUrl(updatedCandidate.profilePicture);
            if (profileImage) {
                updatedCandidate.profilePicture = profileImage;
            }
        }
    }
    return updatedCandidate;
};

const applyToJob = async (candidateId: string, jobId: string): Promise<ICandidateJob> => {
    const job = await jobsModel.findById(jobId);
    if (!job) {
        throw new Error('JOB_NOT_FOUND');
    }

    const candidate = await candidateModel.findById(candidateId);
    if (!candidate) {
        throw new Error('CANDIDATE_NOT_FOUND');
    }

    let candidateJob = await candidateJobModel.findOne({ candidateId, jobId });

    if (candidateJob) {
        if (candidateJob.isJobApplied) {
            throw new Error('JOB_ALREADY_APPLIED');
        }

        candidateJob.isJobApplied = true;
        candidateJob.appliedAt = new Date();
        await candidateJob.save();
    } else {
        candidateJob = await candidateJobModel.create({
            candidateId,
            jobId,
            isJobApplied: true,
            appliedAt: new Date()
        });
    }

    // send email after applying the job
    candidateJobApplied(candidate.email, job.jobTitle).catch((error: any) => {
        console.error('Failed to send job applied email:', error);
    });
    return candidateJob;
};

const saveJob = async (candidateId: string, jobId: string): Promise<ICandidateJob> => {
    const job = await jobsModel.findById(jobId);
    if (!job) {
        throw new Error('JOB_NOT_FOUND');
    }

    const candidate = await candidateModel.findById(candidateId);
    if (!candidate) {
        throw new Error('CANDIDATE_NOT_FOUND');
    }

    let candidateJob = await candidateJobModel.findOne({ candidateId, jobId });

    if (candidateJob) {
        candidateJob.isJobSaved = true;
        candidateJob.savedAt = new Date();
        await candidateJob.save();
    } else {
        candidateJob = await candidateJobModel.create({
            candidateId,
            jobId,
            isJobSaved: true,
            savedAt: new Date()
        });
    }

    return candidateJob;
};

const unsaveJob = async (candidateId: string, jobId: string): Promise<ICandidateJob> => {
    const candidateJob = await candidateJobModel.findOne({ candidateId, jobId });

    if (!candidateJob || !candidateJob.isJobSaved) {
        throw new Error('JOB_NOT_SAVED');
    }

    candidateJob.isJobSaved = false;
    candidateJob.savedAt = undefined;
    await candidateJob.save();

    return candidateJob;
};

const getMyJobs = async (candidateId: string): Promise<ICandidateJob[]> => {
    const myJobs = await candidateJobModel.find({ candidateId })
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

export default { candidateJoin, validateOTP, getCandidateById, getAllCandidateService, getAllJobsByCandidate, updateCandidateService, applyToJob, saveJob, unsaveJob, getMyJobs };
