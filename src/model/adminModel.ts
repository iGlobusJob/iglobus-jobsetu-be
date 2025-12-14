import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import IAdmin from '../interfaces/admin';

const adminSchema = new mongoose.Schema(
    {
        username: { type: mongoose.Schema.Types.String, required: true, unique: true, trim: true },
        password: { type: mongoose.Schema.Types.String, required: true, select: false },
        role: { type: mongoose.Schema.Types.String, default: 'admin' },
        createdAt: { type: mongoose.Schema.Types.Date, default: Date.now },
        updatedAt: { type: mongoose.Schema.Types.Date, default: Date.now },
    },
    {
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

adminSchema.plugin(uniqueValidator);

adminSchema.virtual('id').get(function () {
    return String(this._id);
});

const adminModel = mongoose.model<IAdmin>('adminSchema', adminSchema);
export default adminModel;
