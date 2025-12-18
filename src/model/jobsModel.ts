import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import IJobs from '../interfaces/jobs';

const JobsSchema = new mongoose.Schema(
    {
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'client', required: true },
        organizationName: { type: String, required: true, trim: true },
        logo: { type: String, trim: true },
        jobTitle: { type: String, required: true, trim: true },
        jobDescription: { type: String, trim: true },
        postStart: { type: Date },
        postEnd: { type: Date },
        noOfPositions: { type: Number, min: 1 },
        minimumSalary: { type: Number, min: 0 },
        maximumSalary: { type: Number, min: 0 },
        jobType: { type: String, enum: ['full-time', 'part-time', 'internship', 'freelance', 'contract'] },
        jobLocation: { type: String, trim: true, required: false },
        minimumExperience: { type: Number, min: 0 },
        maximumExperience: { type: Number, min: 0 },
        status: { type: String, enum: ['active', 'closed', 'drafted'], default: 'drafted' },
    },
    {
        collection: 'jobs',
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });

JobsSchema.plugin(uniqueValidator);

JobsSchema.virtual('id').get(function () {
    return String(this._id);
});

const jobsModel = mongoose.model<IJobs>('Jobs', JobsSchema);

export default jobsModel;
