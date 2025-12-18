import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import ICandidateJob from '../interfaces/candidateJob';

const CandidateJobsSchema = new mongoose.Schema(
    {
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs', required: true },
        candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'candidateSchema', required: true },
        isJobSaved: { type: Boolean, default: false },
        isJobApplied: { type: Boolean, default: false },
        appliedAt: { type: Date },
        savedAt: { type: Date },
    },
    {
        collection: 'candidatejobs',
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

CandidateJobsSchema.plugin(uniqueValidator);

CandidateJobsSchema.virtual('id').get(function () {
    return String(this._id);
});

CandidateJobsSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

const candidateJobModel = mongoose.model<ICandidateJob>('CandidateJob', CandidateJobsSchema);
export default candidateJobModel;
