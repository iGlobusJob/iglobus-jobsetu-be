export const CLIENT_SUCCESS_MESSAGES = {
    CLIENT_ADD_SUCCESS_MESSAGE: 'Client registered successfully !',
    CLIENT_LOGIN_SUCCESS_MESSAGE: ' Client login successfully !',
    CLIENT_FETCH_SUCCESS_MESSAGE: 'Client details fetched successfully !',
    CLIENT_PROFILE_UPDATED_SUCCESS_MESSAGE: 'Client profile updated successfully !',
    JOB_CREATED_SUCCESS_MESSAGE: 'Job created successfully !',
    JOB_UPDATED_SUCCESS_MESSAGE: 'Job updated successfully !',
    JOB_DELETED_SUCCESS_MESSAGE: 'Job deleted successfully !',
    JOB_FETCH_SUCCESS_MESSAGE: 'Job details fetched successfully !',
    JOBS_FETCHED_SUCCESS_MESSAGE: 'Jobs fetched successfully !',
    OTP_SENT_SUCCESS: 'OTP sent successfully to your email !',
    OTP_VALIDATION_SUCCESS: 'OTP validated successfully !',
    PASSWORD_UPDATED_SUCCESS: 'Password updated successfully !',
} as const;

export const CLIENT_ERROR_MESSAGES = {
    CLIENT_NOT_FOUND: 'Invalid Account !',
    LOGO_UPLOAD_FAILED: 'An error occurred while uploading logo. Please try again later !',
    CLIENT_ADD_ERROR_MESSAGE: 'Email already exists !',
    CLIENT_FETCH_ERROR_MESSAGE: 'Error in fetching client details !',
    INVALID_CLIENT_DATA: 'Invalid client data provided',
    REGISTRATION_FAILED: 'Email already exist !',
    BAD_CREDENTIALS: 'Incorrect password !',
    ACCOUNT_NOT_ACTIVE: 'Your account is under review by admin for activation !',
    ACCOUNT_DEACTIVATED: 'Your account has been deactivated. Please contact support !',
    LOGIN_FAILED: 'An error occurred during login. Please try again later !',
    INVALID_CLIENT_ID: 'Invalid client ID provided !',
    FETCH_FAILED: 'An error occurred while fetching client details. Please try again later !',
    CLIENT_PROFILE_UPDATE_FAILED: 'An error occurred while updating client profile. Please try again later !',
    JOB_CREATION_FAILED: 'An error occurred while creating the job. Please try again later !',
    JOB_NOT_FOUND_OR_UNAUTHORIZED: 'Job not found or you are not authorized to update this job !',
    JOB_UPDATE_FAILED: 'An error occurred while updating the job. Please try again later !',
    JOB_NOT_FOUND: 'Job not found !',
    JOB_DELETE_ERROR_MESSAGE: ' An error occured while deleting the job !',
    JOBS_FETCH_FAILED: 'An error occurred while fetching jobs. Please try again later !',
    OTP_GENERATION_FAILED: 'An error occurred while generating OTP. Please try again later !',
    OTP_EXPIRED: 'OTP has expired. Please request a new one !',
    INVALID_OTP: 'Invalid OTP. Please try again !',
    OTP_VALIDATION_FAILED: 'An error occurred while validating OTP. Please try again later !',
    PASSWORD_UPDATE_FAILED: 'An error occurred while updating password. Please try again later !',
    EMAIL_NOT_FOUND: 'Email address not found !',
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

export const CLIENT_LOGIN_ERROR_MAPPING: Record<string, { status: number; message: string }> = {
    BAD_CREDENTIALS: {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: CLIENT_ERROR_MESSAGES.BAD_CREDENTIALS
    },
    CLIENT_NOT_FOUND: {
        status: HTTP_STATUS.UNAUTHORIZED,
        message: CLIENT_ERROR_MESSAGES.CLIENT_NOT_FOUND
    },
    ACCOUNT_NOT_ACTIVE: {
        status: HTTP_STATUS.FORBIDDEN,
        message: CLIENT_ERROR_MESSAGES.ACCOUNT_NOT_ACTIVE
    },
    ACCOUNT_DEACTIVATED: {
        status: HTTP_STATUS.FORBIDDEN,
        message: CLIENT_ERROR_MESSAGES.ACCOUNT_DEACTIVATED
    }
};
