import vendorModel from "../model/vendorModel";
import IVendor from "../interfaces/vendor";
import hashPasswordUtility from "../util/hashPassword";
import bcrypt from 'bcrypt';
import jwtUtil from "../util/jwtUtil";
import sendVendorRegistrationEmailUtil from "../util/sendVendorRegistrationEmail";
import sendAdminNotificationUtil from "../util/sendAdminVendorRegistrationNotification";
import jobsModel from "../model/jobsModel";
import IJobs from "../interfaces/jobs";
import uploadLogoUtil from "../util/uploadLogoToS3";

const vendorRegistration = async (vendorData: Partial<IVendor>, file?: Express.Multer.File): Promise<IVendor> => {
    if (!vendorData.password) {
        throw new Error('Password is required');
    }

    const hashedPassword = await hashPasswordUtility.hashPassword(vendorData.password);

    const vendorToSave = {
        ...vendorData,
        password: hashedPassword
    };

    const newVendor = new vendorModel(vendorToSave);
    const savedVendor = await newVendor.save();

    if (file) {
        const timestamp = Date.now();
        const fileName = `logo_${timestamp}_${file.originalname}`;

        try {
            const uploadResult = await uploadLogoUtil.uploadLogoToS3(
                savedVendor.id,
                fileName,
                file.buffer,
                file.mimetype
            );

            savedVendor.logo = uploadResult.fileUrl;
            await savedVendor.save();
        } catch (error) {
            console.error('Error uploading logo during registration:', error);
        }
    }

    // Send registration email asynchronously (non-blocking)
    sendVendorRegistrationEmailUtil.sendVendorRegistrationEmail(
        savedVendor.email,
        savedVendor.organizationName
    ).catch(error => {
        console.log('Failed to send vendor registration email:', error);
    });

    // Send admin notification email asynchronously (non-blocking)
    sendAdminNotificationUtil.sendAdminNotificationEmail(
        savedVendor.organizationName,
        savedVendor.email,
        savedVendor.id
    ).catch(error => {
        console.log('Failed to send admin notification email:', error);
    });

    return savedVendor;
}

const vendorLogin = async (email: string, password: string): Promise<{ vendor: IVendor; token: string }> => {
    const vendor = await vendorModel.findOne({ email }).select('+password');

    if (!vendor) {
        throw new Error('VENDOR_NOT_FOUND');
    }

    const isPasswordValid = await bcrypt.compare(password, vendor.password);

    if (!isPasswordValid) {
        throw new Error('BAD_CREDENTIALS');
    }

    if (vendor.status === 'registered') {
        throw new Error('ACCOUNT_NOT_ACTIVE');
    }

    if (vendor.status !== 'active') {
        throw new Error('ACCOUNT_DEACTIVATED');
    }

    // Generate JWT token
    const token = jwtUtil.generateToken({
        vendorId: vendor.id,
        email: vendor.email,
        organizationName: vendor.organizationName
    });

    return { vendor, token };
}

const getVendorById = async (vendorId: string): Promise<IVendor | null> => {
    const vendor = await vendorModel.findById(vendorId);
    return vendor;
}

const createJobByVendor = async (vendorId: string, jobData: Partial<IJobs>): Promise<IJobs> => {
    const vendor = await vendorModel.findById(vendorId);
    if (!vendor) throw new Error("Vendor not found");
    const jobToSave = {
        ...jobData,
        vendorId,
        organizationName: vendor.organizationName,
    };

    const newJob = new jobsModel(jobToSave);
    const savedJob = await newJob.save();

    return savedJob;
};

const updateJobByVendor = async (vendorId: string, jobId: string, jobData: Partial<IJobs>): Promise<IJobs | null> => {
    const job = await jobsModel.findOne({ _id: jobId, vendorId });

    if (!job) {
        throw new Error('JOB_NOT_FOUND_OR_UNAUTHORIZED');
    }

    const updatedJob = await jobsModel.findByIdAndUpdate(
        jobId,
        { $set: jobData },
        { new: true, runValidators: true }
    );

    return updatedJob;
};

const deleteJob = async (jobId: string, vendorId: string): Promise<{ success: boolean }> => {
    try {
        const result = await jobsModel.findOneAndDelete({ _id: jobId, vendorId: vendorId });

        if (!result) {
            return { success: false };
        }

        return {
            success: true
        };

    } catch (error: any) {
        console.error("Error deleting the job:", error);

        return {
            success: false
        };
    }
};

const getAllJobsByVendor = async (vendorId: string): Promise<IJobs[]> => {
    const jobs = await jobsModel.find({ vendorId }).sort({ createdAt: -1 });
    return jobs;
};

const updateVendorProfile = async (
    vendorId: string,
    updateData: Partial<IVendor>,
    file?: Express.Multer.File
): Promise<IVendor | null> => {
    if (file) {
        const timestamp = Date.now();
        const fileName = `logo_${timestamp}_${file.originalname}`;

        try {
            const uploadResult = await uploadLogoUtil.uploadLogoToS3(
                vendorId,
                fileName,
                file.buffer,
                file.mimetype
            );

            updateData.logo = uploadResult.fileUrl;
        } catch (error) {
            console.error('Error uploading logo to S3:', error);
            throw new Error('LOGO_UPLOAD_FAILED');
        }
    }

    // Hash password if provided
    if (updateData.password) {
        updateData.password = await hashPasswordUtility.hashPassword(updateData.password);
    }

    const updatedVendor = await vendorModel.findByIdAndUpdate(
        vendorId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedVendor) {
        throw new Error('VENDOR_NOT_FOUND');
    }

    return updatedVendor;
};

const getJobByVendor = async (vendorId: string, jobId: string): Promise<IJobs> => {
    const job = await jobsModel.findOne({ _id: jobId, vendorId });

    if (!job) {
        throw new Error('JOB_NOT_FOUND_OR_UNAUTHORIZED');
    }

    return job;
};

export default { vendorRegistration, vendorLogin, getVendorById, createJobByVendor, updateJobByVendor, deleteJob, getAllJobsByVendor, updateVendorProfile, getJobByVendor };
