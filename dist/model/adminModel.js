"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const adminSchema = new mongoose_1.default.Schema({
    username: { type: mongoose_1.default.Schema.Types.String, required: true, unique: true, trim: true },
    password: { type: mongoose_1.default.Schema.Types.String, required: true, select: false },
    role: { type: mongoose_1.default.Schema.Types.String, default: 'admin' },
    createdAt: { type: mongoose_1.default.Schema.Types.Date, default: Date.now },
    updatedAt: { type: mongoose_1.default.Schema.Types.Date, default: Date.now },
}, {
    collection: 'admin',
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
adminSchema.plugin(mongoose_unique_validator_1.default);
adminSchema.virtual('id').get(function () {
    return String(this._id);
});
const adminModel = mongoose_1.default.model('adminSchema', adminSchema);
exports.default = adminModel;
