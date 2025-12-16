export interface CandidateData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    address: string;
    dateOfBirth: string;
    gender: string;
    profile: string,
    profilePicture: string,
    createdAt?: Date;
    updatedAt?: Date;
}

export interface FetchAllCandidateResponse {
    success: boolean;
    candidates: Array<CandidateData>;
}

export interface FetchCandidateByIdResponse {
    success: boolean;
    data: CandidateData;
}
