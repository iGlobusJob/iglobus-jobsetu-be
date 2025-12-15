import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import ICandidate from '../interfaces/candidate';

const candidateSchema = new mongoose.Schema(
    {
        email: { type: mongoose.Schema.Types.String, required: true, unique: true, lowercase: true, trim: true },
        firstName: { type: mongoose.Schema.Types.String, trim: true },
        lastName: { type: mongoose.Schema.Types.String, trim: true },
        mobileNumber: { type: mongoose.Schema.Types.String, trim: true },
        address: { type: mongoose.Schema.Types.String, trim: true },
        dateOfBirth: { type: mongoose.Schema.Types.Date },
        gender: { type: mongoose.Schema.Types.String, trim: true },
        category: { type: mongoose.Schema.Types.String, enum: ['IT', 'Non-IT'], trim: true },
        profile: { type: mongoose.Schema.Types.String, trim: true },
        profileUrl: { type: mongoose.Schema.Types.String, trim: true },
        profilePicture: { type: mongoose.Schema.Types.String, trim: true },
        profilePictureUrl: { type: mongoose.Schema.Types.String, trim: true },
        otp: {
            type: mongoose.Schema.Types.String,
            minlength: 5,
            maxlength: 5,
            match: /^\d{5}$/
        },
        otpexpiredAt: { type: mongoose.Schema.Types.Date },
    },
    {
        collection: 'candidates',
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });

candidateSchema.plugin(uniqueValidator);

candidateSchema.virtual('id').get(function () {
    return String(this._id);
});

const candidateModel = mongoose.model<ICandidate>('candidateSchema', candidateSchema);
export default candidateModel;
