import mongoose, { Document } from 'mongoose';

interface IJobs extends Document {
    clientId: mongoose.Types.ObjectId;
    organizationName: string,
    logo: string,
    jobTitle: string;
    jobDescription?: string;
    postStart?: Date;
    postEnd?: Date;
    noOfPositions?: number;
    minimumSalary?: number;
    maximumSalary?: number;
    jobType?: 'full-time' | 'part-time' | 'internship' | 'freelance' | 'contract';
    jobLocation?: string;
    minimumExperience?: number;
    maximumExperience?: number;
    status?: 'active' | 'closed' | 'drafted';
    createdAt?: Date;
    updatedAt?: Date;
};

export interface FetchAllJobsResponse {
    success: boolean;
    jobs?: any;
};

export default IJobs;
