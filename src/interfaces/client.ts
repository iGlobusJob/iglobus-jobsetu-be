import { Document } from 'mongoose';
import VerificationStatus from '../types/verificationStatus';
import RegistrationStatus from '../types/registrationStatus';

export interface IContact {
    firstName: string;
    lastName: string;
}

interface IClient extends Document {
    primaryContact: IContact;
    organizationName: string;
    email: string;
    password: string;
    secondaryContact?: IContact;
    status?: RegistrationStatus;
    emailStatus?: VerificationStatus;
    mobile: string;
    mobileStatus?: VerificationStatus;
    location?: string;
    gstin: string;
    panCard: string;
    category: 'IT' | 'Non-IT';
    logo?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export default IClient;
