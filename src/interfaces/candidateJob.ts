import mongoose, { Document } from 'mongoose';

interface ICandidatejob extends Document {
    jobId: mongoose.Schema.Types.ObjectId;
    candidateId: mongoose.Schema.Types.ObjectId;
};

export default ICandidatejob;
