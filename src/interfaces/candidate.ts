import { Document } from 'mongoose';

interface ICandidate extends Document {
    email: string;
    firstName?: string;
    lastName?: string;
    mobileNumber?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: string;
    category?: string;
    profile?: string;
    profileUrl?: string;
    profilePicture?: string;
    profilePictureUrl?: string;
    otp?: string;
    designation? :string;
    experience?: number;
    otpexpiredAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CandidateTokenPayload {
    candidateId: string;
    email: string;
};

export interface FetchCandidateByIdResponse {
    success: boolean;
    data?: any;
};

export interface FetchAllCandidateResponse {
    success: boolean;
    candidates?: any;
};

export default ICandidate;
