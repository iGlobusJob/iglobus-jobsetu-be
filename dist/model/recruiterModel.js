"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const recruiterSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
}, {
    collection: 'recruiters',
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.password;
            return ret;
        }
    }
});
recruiterSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH} already exists' });
recruiterSchema.virtual('id').get(function () {
    return String(this._id);
});
// Add index for better query performance
recruiterSchema.index({ email: 1 });
const recruiterModel = mongoose_1.default.model('Recruiter', recruiterSchema);
exports.default = recruiterModel;
