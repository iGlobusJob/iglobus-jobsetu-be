import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import IRecruiter from '../interfaces/recruiter';

const recruiterSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, select: false },
    },
    {
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
    }
);

recruiterSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

recruiterSchema.virtual('id').get(function () {
    return String(this._id);
});

// Add index for better query performance
recruiterSchema.index({ email: 1 });

const recruiterModel = mongoose.model<IRecruiter>('Recruiter', recruiterSchema);
export default recruiterModel;
