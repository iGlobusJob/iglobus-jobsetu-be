import candidateModel from '../model/candidateModel';
import jobsModel from '../model/jobsModel';
import { FetchAllCandidateResponse, FetchCandidateByIdResponse } from '../interfaces/common';
import IJobs, { FetchAllJobsResponse } from '../interfaces/jobs';

const getAllCandidates = async (): Promise<FetchAllCandidateResponse> => {
    try {
        const candidates = await candidateModel.find();

        const formattedCandidates = candidates.map(candidate => ({
            id: candidate.id,
            email: candidate.email || '',
            firstName: candidate.firstName || '',
            lastName: candidate.lastName || '',
            mobileNumber: candidate.mobileNumber || '',
            address: candidate.address || '',
            dateOfBirth: candidate.dateOfBirth || '',
            gender: candidate.gender || '',
            category: candidate.category  || '',
            profile: candidate.profile || '',
            profilePicture:candidate.profilePicture || '',
            createdAt: candidate.createdAt,
            updatedAt: candidate.updatedAt
        }));

        return {
            success: true,
            candidates: formattedCandidates
        };
    } catch (error) {
        throw new Error("Failed to fetch candidate details");
    }
};

const getCandidateById = async (id: string): Promise<FetchCandidateByIdResponse> => {
    const candidate = await candidateModel.findById(id);

    if (!candidate) {
        throw new Error('CANDIDATE_NOT_FOUND');
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
            profilePicture: candidate.profilePicture || '' ,
            createdAt: candidate.createdAt,
            updatedAt: candidate.updatedAt
        }
    };
};

const getJobById = async (id: string): Promise<any> => {
    const job = await jobsModel.findById(id).populate({
        path: 'vendorId',
        select: 'organizationName primaryContact logo'
    });

    if (!job) {
        throw new Error('JOB_NOT_FOUND');
    }

    const vendor = job.vendorId as any;
    return {
        id: job.id,
        vendorId: vendor?._id || job.vendorId,
        organizationName: vendor?.organizationName || '',
        primaryContactFirstName: vendor?.primaryContact?.firstName || '',
        primaryContactLastName: vendor?.primaryContact?.lastName || '',
        logo: vendor?.logo || '',
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
        const jobs = await jobsModel.find().populate({
            path: 'vendorId',
            select: 'organizationName primaryContact logo'
        });

        const alljobs = jobs.map(job => {
            const vendor = job.vendorId as any;
            return {
                id: job.id,
                vendorId: vendor?._id || job.vendorId,
                organizationName: vendor?.organizationName || '',
                primaryContactFirstName: vendor?.primaryContact?.firstName || '',
                primaryContactLastName: vendor?.primaryContact?.lastName || '',
                logo: vendor?.logo || '',
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

export default { getAllCandidates, getCandidateById, getJobById, getAllJobs };
