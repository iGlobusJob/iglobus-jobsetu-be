export const CANDIDATE_SUCCESS_MESSAGES = {
    OTP_SENT_SUCCESS: 'OTP sent successfully !',
    OTP_VALIDATION_SUCCESS: 'OTP Validation successfully !',
    CANDIDATE_FETCH_SUCCESS_MESSAGE: 'Candidate details fetched successfully !',
    JOBS_FETCHED_SUCCESS_MESSAGE: 'Jobs fetched successfully !',
    CANDIDATE_UPDATED_SUCCESS_MESSAGE: 'Candidate details updated successfully !'
} as const;

export const CANDIDATE_ERROR_MESSAGES = {
    INVALID_EMAIL: 'Invalid email address provided !',
    OTP_GENERATION_FAILED: 'An error occurred while generating OTP. Please try again later !',
    OTP_EXPIRED: 'Password Expired, Please join again !',
    INVALID_OTP: 'Invalid OTP !',
    CANDIDATE_NOT_FOUND: 'Candidate not found !',
    OTP_VALIDATION_FAILED: 'An error occurred during OTP validation. Please try again later !',
    CANDIDATE_ERROR_FETCH_MESSAGE: 'An error occurred while fetching candidate details !',
    FETCH_ALLCANDIDATES_ERROR_MESSAGE: 'An error occurred while fetching all candidate details !',
    JOBS_FETCH_FAILED: 'An error occurred while fetching jobs. Please try again later !',
    CANDIDATE_PROFILE_UPDATE_FAILED: 'An error occurred while updating candidate details. Please try again later !',
    RESUME_UPLOAD_FAILED: 'An error occurred while uploading resume. Please try again later !'

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

export const ERROR_MAPPING: Record<string, { status: number; message: string }> = {
    'CANDIDATE_NOT_FOUND': { status: HTTP_STATUS.NOT_FOUND, message: CANDIDATE_ERROR_MESSAGES.CANDIDATE_NOT_FOUND },
    'OTP_EXPIRED': { status: HTTP_STATUS.BAD_REQUEST, message: CANDIDATE_ERROR_MESSAGES.OTP_EXPIRED },
    'INVALID_OTP': { status: HTTP_STATUS.BAD_REQUEST, message: CANDIDATE_ERROR_MESSAGES.INVALID_OTP }
};
