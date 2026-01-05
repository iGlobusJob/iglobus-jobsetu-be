import mongoose from 'mongoose';
import adminModel from '../model/adminModel';
import candidateModel from '../model/candidateModel';
import candidateJobModel from '../model/candidateJobModel';
import clientModel from '../model/clientModel';
import jobsModel from '../model/jobsModel';
import recruiterModel from '../model/recruiterModel';

/**
 * Initialize all collections in MongoDB
 * This ensures all collections are created even if empty
 */
export const initializeCollections = async (): Promise<void> => {
    try {
        const db = mongoose.connection.db;

        if (!db) {
            console.error('Database connection not established');
            return;
        }

        // Get all existing collections
        const collections = await db.listCollections().toArray();
        const existingCollections = collections.map(col => col.name);

        // Define all collections that should exist
        const requiredCollections = [
            { name: 'admin', model: adminModel },
            { name: 'candidates', model: candidateModel },
            { name: 'candidatejobs', model: candidateJobModel },
            { name: 'client', model: clientModel },
            { name: 'jobs', model: jobsModel },
            { name: 'recruiters', model: recruiterModel }
        ];

        // Create missing collections
        for (const collection of requiredCollections) {
            try {
                if (!existingCollections.includes(collection.name)) {
                    await db.createCollection(collection.name);
                    console.warn(`✓ Created collection: ${collection.name}`);
                } else {
                    console.warn(`✓ Collection already exists: ${collection.name}`);
                }

                // Ensure indexes are created (sync indexes without throwing on conflicts)
                await collection.model.syncIndexes();
            } catch (error: any) {
                // Ignore index conflicts - indexes already exist
                if (error.code !== 86) {
                    console.warn(`Warning for collection ${collection.name}:`, error.message);
                }
            }
        }

        console.warn('All collections initialized successfully');
    } catch (error) {
        console.error('Error initializing collections:', error);
        // Don't throw - allow the application to continue
    }
};
