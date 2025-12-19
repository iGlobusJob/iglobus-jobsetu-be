import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import IClient from '../interfaces/client';

const clientSchema = new mongoose.Schema(
    {
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
    },
    {
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
    }
);

clientSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

clientSchema.virtual('id').get(function () {
    return String(this._id);
});

// Add index for better query performance
clientSchema.index({ organizationName: 1 });

const clientModel = mongoose.model<IClient>('client', clientSchema);
export default clientModel;
