"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCollections = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const adminModel_1 = __importDefault(require("../model/adminModel"));
const candidateModel_1 = __importDefault(require("../model/candidateModel"));
const candidateJobModel_1 = __importDefault(require("../model/candidateJobModel"));
const clientModel_1 = __importDefault(require("../model/clientModel"));
const jobsModel_1 = __importDefault(require("../model/jobsModel"));
const recruiterModel_1 = __importDefault(require("../model/recruiterModel"));
/**
 * Initialize all collections in MongoDB
 * This ensures all collections are created even if empty
 */
const initializeCollections = async () => {
    try {
        const db = mongoose_1.default.connection.db;
        if (!db) {
            console.error('Database connection not established');
            return;
        }
        // Get all existing collections
        const collections = await db.listCollections().toArray();
        const existingCollections = collections.map(col => col.name);
        // Define all collections that should exist
        const requiredCollections = [
            { name: 'admin', model: adminModel_1.default },
            { name: 'candidates', model: candidateModel_1.default },
            { name: 'candidatejobs', model: candidateJobModel_1.default },
            { name: 'client', model: clientModel_1.default },
            { name: 'jobs', model: jobsModel_1.default },
            { name: 'recruiters', model: recruiterModel_1.default }
        ];
        // Create missing collections
        for (const collection of requiredCollections) {
            if (!existingCollections.includes(collection.name)) {
                await db.createCollection(collection.name);
                console.log(`✓ Created collection: ${collection.name}`);
            }
            else {
                console.log(`✓ Collection already exists: ${collection.name}`);
            }
            // Ensure indexes are created
            await collection.model.init();
        }
        console.log('All collections initialized successfully');
    }
    catch (error) {
        console.error('Error initializing collections:', error);
        throw error;
    }
};
exports.initializeCollections = initializeCollections;
