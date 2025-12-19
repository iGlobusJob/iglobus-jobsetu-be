"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const CandidateJobsSchema = new mongoose_1.default.Schema({
    jobId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Jobs', required: true },
    candidateId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'candidateSchema', required: true },
    isJobSaved: { type: Boolean, default: false },
    isJobApplied: { type: Boolean, default: false },
    appliedAt: { type: Date },
    savedAt: { type: Date },
}, {
    collection: 'candidatejobs',
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
CandidateJobsSchema.plugin(mongoose_unique_validator_1.default);
CandidateJobsSchema.virtual('id').get(function () {
    return String(this._id);
});
CandidateJobsSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });
const candidateJobModel = mongoose_1.default.model('CandidateJob', CandidateJobsSchema);
exports.default = candidateJobModel;
