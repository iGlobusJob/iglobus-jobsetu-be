import mongoose, { Document } from 'mongoose';

interface ICandidateJob extends Document {
    jobId: mongoose.Schema.Types.ObjectId;
    candidateId: mongoose.Schema.Types.ObjectId;
    isJobSaved: boolean;
    isJobApplied: boolean;
    appliedAt?: Date;
    savedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export default ICandidateJob;
