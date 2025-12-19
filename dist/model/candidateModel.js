"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const candidateSchema = new mongoose_1.default.Schema({
    email: { type: mongoose_1.default.Schema.Types.String, required: true, unique: true, lowercase: true, trim: true },
    firstName: { type: mongoose_1.default.Schema.Types.String, trim: true },
    lastName: { type: mongoose_1.default.Schema.Types.String, trim: true },
    mobileNumber: { type: mongoose_1.default.Schema.Types.String, trim: true },
    address: { type: mongoose_1.default.Schema.Types.String, trim: true },
    dateOfBirth: { type: mongoose_1.default.Schema.Types.Date },
    gender: { type: mongoose_1.default.Schema.Types.String, trim: true },
    category: { type: mongoose_1.default.Schema.Types.String, enum: ['IT', 'Non-IT'], trim: true },
    profile: { type: mongoose_1.default.Schema.Types.String, trim: true },
    profileUrl: { type: mongoose_1.default.Schema.Types.String, trim: true },
    profilePicture: { type: mongoose_1.default.Schema.Types.String, trim: true },
    profilePictureUrl: { type: mongoose_1.default.Schema.Types.String, trim: true },
    otp: {
        type: mongoose_1.default.Schema.Types.String,
        minlength: 5,
        maxlength: 5,
        match: /^\d{5}$/
    },
    otpexpiredAt: { type: mongoose_1.default.Schema.Types.Date },
}, {
    collection: 'candidates',
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
candidateSchema.plugin(mongoose_unique_validator_1.default);
candidateSchema.virtual('id').get(function () {
    return String(this._id);
});
const candidateModel = mongoose_1.default.model('candidateSchema', candidateSchema);
exports.default = candidateModel;
