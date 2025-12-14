import { Document } from 'mongoose';

interface IAdmin extends Document {
    username: string;
    password: string;
    role: string;
};

export interface AdminTokenPayload {
    adminId: string;
    username: string;
    role: string;
}

export interface FetchAllJobsResponse {
    success: boolean;
    jobs?: any;
}

export interface FetchAllClientsResponse {
    success: boolean;
    clients?: any;
}

export default IAdmin;
