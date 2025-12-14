export const VENDOR_SUCCESS_MESSAGES = {
    VENDOR_ADD_SUCCESS_MESSAGE: 'Vendor registered successfully !',
    VENDOR_LOGIN_SUCCESS_MESSAGE: ' Vendor login successfully !',
    VENDOR_FETCH_SUCCESS_MESSAGE: 'Vendor details fetched successfully !',
    VENDOR_PROFILE_UPDATED_SUCCESS_MESSAGE: 'Vendor profile updated successfully !',
    JOB_CREATED_SUCCESS_MESSAGE: 'Job created successfully !',
    JOB_UPDATED_SUCCESS_MESSAGE: 'Job updated successfully !',
    JOB_DELETED_SUCCESS_MESSAGE: 'Job deleted successfully !',
    JOB_FETCH_SUCCESS_MESSAGE: 'Job details fetched successfully !',
    JOBS_FETCHED_SUCCESS_MESSAGE: 'Jobs fetched successfully !',
} as const;

export const VENDOR_ERROR_MESSAGES = {
    LOGO_UPLOAD_FAILED: 'An error occurred while uploading logo. Please try again later !',
    VENDOR_ADD_ERROR_MESSAGE: 'Email already exists !',
    VENDOR_FETCH_ERROR_MESSAGE: 'Error in fetching vendor details !',
    VENDOR_NOT_FOUND: 'Invalid Account !',
    INVALID_VENDOR_DATA: 'Invalid vendor data provided',
    REGISTRATION_FAILED: 'Email already exist !',
    BAD_CREDENTIALS: 'Incorrect password !',
    ACCOUNT_NOT_ACTIVE: 'Your account is under review by admin for activation !',
    ACCOUNT_DEACTIVATED: 'Your account has been deactivated. Please contact support !',
    LOGIN_FAILED: 'An error occurred during login. Please try again later !',
    INVALID_VENDOR_ID: 'Invalid vendor ID provided !',
    FETCH_FAILED: 'An error occurred while fetching vendor details. Please try again later !',
    VENDOR_PROFILE_UPDATE_FAILED: 'An error occurred while updating vendor profile. Please try again later !',
    JOB_CREATION_FAILED: 'An error occurred while creating the job. Please try again later !',
    JOB_NOT_FOUND_OR_UNAUTHORIZED: 'Job not found or you are not authorized to update this job !',
    JOB_UPDATE_FAILED: 'An error occurred while updating the job. Please try again later !',
    JOB_NOT_FOUND: 'Job not found !',
    JOB_DELETE_ERROR_MESSAGE: ' An error occured while deleting the job !',
    JOBS_FETCH_FAILED: 'An error occurred while fetching jobs. Please try again later !',
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export const VENDOR_LOGIN_ERROR_MAPPING: Record<string, { status: number; message: string }> = {
    BAD_CREDENTIALS: {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: VENDOR_ERROR_MESSAGES.BAD_CREDENTIALS
    },
    VENDOR_NOT_FOUND: {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: VENDOR_ERROR_MESSAGES.VENDOR_NOT_FOUND
    },
    ACCOUNT_NOT_ACTIVE: {
        status: HTTP_STATUS.FORBIDDEN,
        message: VENDOR_ERROR_MESSAGES.ACCOUNT_NOT_ACTIVE
    },
    ACCOUNT_DEACTIVATED: {
        status: HTTP_STATUS.FORBIDDEN,
        message: VENDOR_ERROR_MESSAGES.ACCOUNT_DEACTIVATED
    }
};
