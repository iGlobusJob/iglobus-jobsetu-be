import { Document } from 'mongoose';

interface IRecruiter extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface RecruiterTokenPayload {
    recruiterId: string;
    email: string;
    firstName: string;
    lastName: string;
}

export default IRecruiter;
