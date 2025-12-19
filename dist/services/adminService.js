"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminModel_1 = __importDefault(require("../model/adminModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtUtil_1 = __importDefault(require("../util/jwtUtil"));
const clientModel_1 = __importDefault(require("../model/clientModel"));
const hashPassword_1 = __importDefault(require("../util/hashPassword"));
const candidateModel_1 = __importDefault(require("../model/candidateModel"));
const recruiterModel_1 = __importDefault(require("../model/recruiterModel"));
const adminLogin = async (username, password) => {
    const admin = await adminModel_1.default.findOne({ username }).select('+password');
    if (!admin) {
        throw new Error('ADMIN_NOT_FOUND');
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, admin.password);
    if (!isPasswordValid) {
        throw new Error('BAD_CREDENTIALS');
    }
    const token = jwtUtil_1.default.generateToken({
        adminId: admin.id,
        username: admin.username,
        role: admin.role
    });
    return { admin, token };
};
const updateClientByAdmin = async (clientId, updateData) => {
    const _a = updateData, { email } = _a, allowedUpdateData = __rest(_a, ["email"]);
    if (allowedUpdateData.password) {
        allowedUpdateData.password = await hashPassword_1.default.hashPassword(allowedUpdateData.password);
    }
    const updatedClient = await clientModel_1.default.findByIdAndUpdate(clientId, { $set: allowedUpdateData }, { new: true, runValidators: true });
    if (!updatedClient) {
        throw new Error('CLIENT_NOT_FOUND');
    }
    return updatedClient;
};
const getClientById = async (clientId) => {
    const client = await clientModel_1.default.findById(clientId);
    return client;
};
const getCandidateDetailsByService = async (candidateId) => {
    const candidate = await candidateModel_1.default.findById(candidateId);
    return candidate;
};
const createAdminService = async (username, password, role) => {
    const existingAdmin = await adminModel_1.default.findOne({ username });
    if (existingAdmin) {
        throw new Error('ADMIN_ALREADY_EXISTS');
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const admin = await adminModel_1.default.create({
        username,
        password: hashedPassword,
        role
    });
    return admin;
};
const getAllClientsService = async () => {
    try {
        const clients = await clientModel_1.default.find();
        const formattedClients = clients.map(client => ({
            primaryContact: {
                firstName: client.primaryContact.firstName,
                lastName: client.primaryContact.lastName
            },
            organizationName: client.organizationName,
            logo: client.logo,
            email: client.email,
            status: client.status,
            emailStatus: client.emailStatus,
            mobile: client.mobile,
            mobileStatus: client.mobileStatus,
            category: client.category,
            gstin: client.gstin,
            panCard: client.panCard,
            id: client.id,
            createdAt: client.createdAt,
            updatedAt: client.updatedAt
        }));
        return {
            success: true,
            clients: formattedClients
        };
    }
    catch (error) {
        throw new Error("Failed to fetch clients");
    }
    ;
};
const createRecruiterService = async (firstName, lastName, email, password) => {
    // Check if recruiter already exists
    const existingRecruiter = await recruiterModel_1.default.findOne({ email });
    if (existingRecruiter) {
        throw new Error('RECRUITER_ALREADY_EXISTS');
    }
    // Hash the password
    const hashedPassword = await hashPassword_1.default.hashPassword(password);
    // Create recruiter
    const recruiter = await recruiterModel_1.default.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });
    return recruiter;
};
const getAllRecruitersService = async () => {
    try {
        const recruiters = await recruiterModel_1.default.find();
        const formattedRecruiters = recruiters.map(recruiter => ({
            id: recruiter.id,
            firstName: recruiter.firstName,
            lastName: recruiter.lastName,
            email: recruiter.email,
            createdAt: recruiter.createdAt,
            updatedAt: recruiter.updatedAt
        }));
        return {
            success: true,
            recruiters: formattedRecruiters
        };
    }
    catch (error) {
        throw new Error("Failed to fetch recruiters");
    }
};
exports.default = { adminLogin, createAdminService, updateClientByAdmin, getClientById, getCandidateDetailsByService, getAllClientsService, createRecruiterService, getAllRecruitersService };
