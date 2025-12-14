export const ADMIN_SUCCESS_MESSAGE = {
    ADMIN_LOGIN_SUCCESS_MESSAGE: 'Logged in Successfully !',
    CLIENT_UPDATED_SUCCESS_MESSAGE: 'Client updated successfully !',
    VENDOR_DETAILS_FETCHED_SUCCESS_MESSAGE: 'Vendor details fetched successfully !',
    VENDOR_UPDATED_SUCCESS_MESSAGE: 'Vendor updated successfully !',
    ADMIN_FETCHED_JOBS_SUCCESS_MESSAGE: 'Jobs fetched successfully !',
    CANDIDATE_DETAILS_FETCHED_SUCCESS_MESSAGE: 'Candidate details fetched successfully !',
    ADMIN_CREATED_SUCCESS_MESSAGE: 'Admin created successfully !',
    RECRUITER_CREATED_SUCCESS_MESSAGE: 'Recruiter created successfully !',
    RECRUITERS_FETCHED_SUCCESS_MESSAGE: 'Recruiters fetched successfully !'
} as const;

export const ADMIN_ERROR_MESSAGES = {
    ADMIN_NOT_FOUND: 'Admin not found !',
    BAD_CREDENTIALS: 'Bad Credentials !',
    LOGIN_FAILED: 'An error occurred during login. Please try again later !',
    CLIENT_UPDATE_FAILED: 'An error occurred while updating client details. Please try again later !',
    UPDATE_FAILED: 'An error occurred while updating vendor details. Please try again later !',
    VENDOR_NOT_FOUND: 'Vendor not found !',
    CLIENTS_FETCH_ERROR_MESSAGE: 'Error in fetching client details !',
    VENDOR_FETCH_FAILED: 'An error occurred while fetching vendor details. Please try again later !',
    ADMIN_FETCH_JOBS_FAILED: 'An error occurred while fetching  all jobs. Please try again later !',
    CANDIDATE_FETCH_FAILED: 'An error occured while  fetching candidate details. please try again later !',
    CANDIDATE_NOT_FOUND: 'candidate not found !',
    ADMIN_CREATION_FAILED: 'An error occured while creating admin !',
    ADMIN_ALREADY_EXISTS: 'Admin with this username already exists !',
    RECRUITER_CREATION_FAILED: 'An error occurred while creating recruiter. Please try again later !',
    RECRUITER_ALREADY_EXISTS: 'Recruiter with this email already exists !',
    RECRUITERS_FETCH_ERROR_MESSAGE: 'An error occurred while fetching recruiters. Please try again later !'
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
    'ADMIN_NOT_FOUND': { status: HTTP_STATUS.NOT_FOUND, message: ADMIN_ERROR_MESSAGES.ADMIN_NOT_FOUND },
    'BAD_CREDENTIALS': { status: HTTP_STATUS.UNAUTHORIZED, message: ADMIN_ERROR_MESSAGES.BAD_CREDENTIALS },
    'ADMIN_ALREADY_EXISTS': { status: HTTP_STATUS.CONFLICT, message: ADMIN_ERROR_MESSAGES.ADMIN_ALREADY_EXISTS },
    'RECRUITER_ALREADY_EXISTS': { status: HTTP_STATUS.CONFLICT, message: ADMIN_ERROR_MESSAGES.RECRUITER_ALREADY_EXISTS }
};

