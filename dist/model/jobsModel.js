"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const JobsSchema = new mongoose_1.default.Schema({
    clientId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'client', required: true },
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
}, {
    collection: 'jobs',
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
JobsSchema.plugin(mongoose_unique_validator_1.default);
JobsSchema.virtual('id').get(function () {
    return String(this._id);
});
const jobsModel = mongoose_1.default.model('Jobs', JobsSchema);
exports.default = jobsModel;
