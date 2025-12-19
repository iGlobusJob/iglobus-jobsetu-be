"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const userSchema = joi_1.default.object({
    userId: joi_1.default.string().min(3).max(30).optional(),
    firstName: joi_1.default.string().min(3).max(30).optional(),
    lastName: joi_1.default.string().min(3).max(30).optional(),
    email: joi_1.default.string().email().required(),
    mobileNumber: joi_1.default.number().integer().min(0).optional(),
    dateOfBirth: joi_1.default.date().optional(),
    presentAddress: joi_1.default.string().optional(),
    permanentAddress: joi_1.default.string().optional()
});
exports.default = userSchema;
