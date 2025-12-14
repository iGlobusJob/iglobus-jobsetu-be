import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import jobsModel from './jobsModel';
import candidateModel from './candidateModel';
import ICandidatejob from '../interfaces/candidateJob';
import { required } from 'joi';

const CandidateJobsSchema = new mongoose.Schema (
    {
        condidatejobId: { type: mongoose.Schema.Types.ObjectId, required: true },
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: jobsModel, required: true },
        candidateId: { type: mongoose.Schema.Types.ObjectId, ref: candidateModel, required: true },
    },
    {
        collection: 'candidatejobs',
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });

CandidateJobsSchema.plugin(uniqueValidator);

CandidateJobsSchema.virtual('id').get(function () {
    return String(this._id);
});

const candidatejobsModel = mongoose.model<ICandidatejob>('CandidateJobsSchema', CandidateJobsSchema);
export default candidatejobsModel;
