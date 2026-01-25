import candidateModel from '../model/candidateModel';
import jobsModel from '../model/jobsModel';
import candidateJobModel from '../model/candidateJobModel';
import { FetchAllCandidateResponse, FetchCandidateByIdResponse } from '../interfaces/common';
import { FetchAllJobsResponse } from '../interfaces/jobs';
import presignedUrlUtil from '../util/generatePresignedUrl';
import sendContactUsMailUtility from '../util/sendContactUsEmail';
import IJobs from '../interfaces/jobs';

const getAllCandidates = async (): Promise<FetchAllCandidateResponse> => {
    try {
        const candidates = await candidateModel.find();

        const formattedCandidates = await Promise.all(candidates.map(async candidate => {
            let profileUrl: string | null = null;
            if (candidate.profile) {
                profileUrl = await presignedUrlUtil.generatePresignedUrl(candidate.profile);
            }
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
    } catch (error) {
        throw new Error('Failed to fetch candidate details');
    }
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

const getJobById = async (id: string): Promise<any> => {
    const job = await jobsModel.findById(id).populate({
        path: 'clientId',
        select: 'organizationName primaryContact logo'
    });

    if (!job) {
        throw new Error('JOB_NOT_FOUND');
    }

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
};

const getAllJobs = async (): Promise<FetchAllJobsResponse> => {
    try {
        const now = new Date();
        const jobs = await jobsModel.find({ postStart: { $lte: now } }).populate({
            path: 'clientId',
            select: 'organizationName primaryContact logo status'
        });

        const activeClientJobs = jobs.filter(job => {
            const client = job.clientId as any;
            return client?.status === 'active';
        });

        const sortedJobs = activeClientJobs.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });

        const alljobs = sortedJobs.map(job => {
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

const sendContactUsMail = async (mailDetailsToFire: any) => {
    try {
        // Send email to admin
        await sendContactUsMailUtility.sendContactUsMail(mailDetailsToFire);

        // Send thank you email to customer
        await sendContactUsMailUtility.sendThankYouEmailToCustomer(mailDetailsToFire);
    } catch (error) {
        console.error(`Error in sending Email at services: ${error}`);
        return error;
    }
};

const getAllJobsByClient = async (clientId: string): Promise<IJobs[]> => {
    const jobs = await jobsModel.find({ clientId }).sort({ createdAt: -1 });
    return jobs;
};

const getJobWithApplicants = async (jobId: string): Promise<any> => {
    const job = await jobsModel.findById(jobId).populate({
        path: 'clientId',
        select: 'organizationName primaryContact logo'
    });

    if (!job) {
        throw new Error('JOB_NOT_FOUND');
    }

    // Get all candidates who applied for this job
    const candidateJobs = await candidateJobModel.find({ jobId, isJobApplied: true }).populate({
        path: 'candidateId',
        select: 'email firstName lastName mobileNumber address dateOfBirth gender category profile profilePicture designation experience createdAt updatedAt'
    });

    const applicants = await Promise.all(candidateJobs.map(async (candidateJob) => {
        const candidate = candidateJob.candidateId as any;
        if (!candidate) return null;

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
        const dateA = a?.appliedAt ? new Date(a.appliedAt).getTime() : 0;
        const dateB = b?.appliedAt ? new Date(b.appliedAt).getTime() : 0;
        return dateB - dateA;
    });

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
        updatedAt: job.updatedAt,
        applicants: sortedApplicants,
        totalApplicants: sortedApplicants.length
    };
};

export default { getAllCandidates, getCandidateById, getJobById, getAllJobs, sendContactUsMail, getAllJobsByClient, getJobWithApplicants };
