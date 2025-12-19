"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const clientSchema = new mongoose_1.default.Schema({
    primaryContact: {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
    },
    organizationName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    secondaryContact: {
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
    },
    status: { type: String, enum: ['registered', 'active', 'inactive'], default: 'registered' },
    emailStatus: { type: String, enum: ['verified', 'notverified'], default: 'notverified' },
    mobile: { type: String, trim: true },
    mobileStatus: { type: String, enum: ['verified', 'notverified'], default: 'notverified' },
    location: { type: String, trim: true },
    gstin: { type: String, trim: true, uppercase: true, required: true },
    panCard: { type: String, trim: true, uppercase: true, required: true },
    category: { type: String, enum: ['IT', 'Non-IT'], required: true },
    logo: { type: String, trim: true },
}, {
    collection: 'client',
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
clientSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH} already exists' });
clientSchema.virtual('id').get(function () {
    return String(this._id);
});
// Add index for better query performance
clientSchema.index({ organizationName: 1 });
const clientModel = mongoose_1.default.model('client', clientSchema);
exports.default = clientModel;
