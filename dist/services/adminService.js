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
const jobsModel_1 = __importDefault(require("../model/jobsModel"));
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
        // Sort clients: registered first, then inactive, then active
        const statusOrder = {
            'registered': 1,
            'inactive': 2,
            'active': 3
        };
        const sortedClients = formattedClients.sort((a, b) => {
            var _a, _b, _c, _d, _e, _f;
            const statusA = (_a = a.status) !== null && _a !== void 0 ? _a : 'active';
            const statusB = (_b = b.status) !== null && _b !== void 0 ? _b : 'active';
            const statusDiff = ((_c = statusOrder[statusA]) !== null && _c !== void 0 ? _c : 4) - ((_d = statusOrder[statusB]) !== null && _d !== void 0 ? _d : 4);
            if (statusDiff !== 0) {
                return statusDiff;
            }
            const dateA = new Date((_e = a.updatedAt) !== null && _e !== void 0 ? _e : 0).getTime();
            const dateB = new Date((_f = b.updatedAt) !== null && _f !== void 0 ? _f : 0).getTime();
            return dateB - dateA;
        });
        return {
            success: true,
            clients: sortedClients
        };
    }
    catch (error) {
        throw new Error('Failed to fetch clients');
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
        password: hashedPassword,
        isDeleted: false
    });
    return recruiter;
};
const getAllRecruitersService = async () => {
    try {
        const recruiters = await recruiterModel_1.default.find({ isDeleted: false }).sort({ createdAt: -1 });
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
        throw new Error('Failed to fetch recruiters');
    }
};
const deleteRecruiterByAdminService = async (recruiterId) => {
    const deletedRecruiter = await recruiterModel_1.default.findByIdAndUpdate(recruiterId, { isDeleted: true }, { new: true });
    if (!deletedRecruiter) {
        throw new Error('RECRUITER_NOT_FOUND');
    }
    return {
        success: true,
    };
};
const getAllJobsByAdminService = async () => {
    try {
        const now = new Date();
        const jobs = await jobsModel_1.default.find({ postStart: { $lte: now } }).populate({
            path: 'clientId',
            select: 'organizationName primaryContact logo'
        });
        const alljobs = jobs.map(job => {
            var _a, _b;
            const client = job.clientId;
            return {
                id: job.id,
                clientId: (client === null || client === void 0 ? void 0 : client._id) || job.clientId,
                organizationName: (client === null || client === void 0 ? void 0 : client.organizationName) || '',
                primaryContactFirstName: ((_a = client === null || client === void 0 ? void 0 : client.primaryContact) === null || _a === void 0 ? void 0 : _a.firstName) || '',
                primaryContactLastName: ((_b = client === null || client === void 0 ? void 0 : client.primaryContact) === null || _b === void 0 ? void 0 : _b.lastName) || '',
                logo: (client === null || client === void 0 ? void 0 : client.logo) || '',
                jobTitle: job.jobTitle,
                jobDescription: job.jobDescription,
                postStart: job.postStart,
                postEnd: job.postEnd,
                noOfPositions: job.noOfPositions,
                minimumSalary: job.minimumSalary,
                maximumSalary: job.maximumSalary,
                jobType: job.jobType,
                jobLocation: job.jobLocation,
                minimumExperience: job.minimumExperience,
                maximumExperience: job.maximumExperience,
                status: job.status,
                createdAt: job.createdAt,
                updatedAt: job.updatedAt
            };
        });
        return {
            success: true,
            jobs: alljobs
        };
    }
    catch (error) {
        throw new Error(`Failed to fetch all jobs: ${error}`);
    }
    ;
};
exports.default = { adminLogin, createAdminService, updateClientByAdmin, getClientById, getCandidateDetailsByService, getAllClientsService, createRecruiterService, getAllRecruitersService, deleteRecruiterByAdminService, getAllJobsByAdminService };
