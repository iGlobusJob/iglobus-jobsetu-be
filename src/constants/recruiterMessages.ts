export const RECRUITER_SUCCESS_MESSAGE = {
  RECRUITER_LOGIN_SUCCESS_MESSAGE: 'Logged in successfully !',
  RECRUITER_FETCHED_JOBS_SUCCESS_MESSAGE: 'Jobs fetched successfully !',
  JOB_DETAILS_FETCHED_SUCCESS_MESSAGE: 'Job details fetched successfully !',
  CLIENTS_FETCHED_SUCCESS_MESSAGE: 'Clients fetched successfully !',
  CLIENT_DETAILS_FETCHED_SUCCESS_MESSAGE: 'Client details fetched successfully !',
  CANDIDATES_FETCHED_SUCCESS_MESSAGE: 'Candidates fetched successfully !',
  CANDIDATE_DETAILS_FETCHED_SUCCESS_MESSAGE:
    'Candidate details fetched successfully !',
} as const;

export const RECRUITER_ERROR_MESSAGES = {
  RECRUITER_NOT_FOUND: 'Recruiter not found !',
  BAD_CREDENTIALS: 'Bad credentials !',
  LOGIN_FAILED:
    'An error occurred during login. Please try again later !',
  RECRUITER_FETCH_JOBS_FAILED:
    'An error occurred while fetching jobs. Please try again later !',
  JOB_NOT_FOUND: 'Job not found !',
  JOB_FETCH_FAILED:
    'An error occurred while fetching job details. Please try again later !',
  CLIENTS_FETCH_ERROR_MESSAGE:
    'An error occurred while fetching client details !',
  CLIENT_NOT_FOUND: 'Client not found !',
  CLIENT_FETCH_FAILED:
    'An error occurred while fetching client details. Please try again later !',
  CANDIDATE_FETCH_FAILED:
    'An error occurred while fetching candidate details. Please try again later !',
  CANDIDATE_NOT_FOUND: 'Candidate not found !',
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

export const ERROR_MAPPING: Record<
  string,
  { status: number; message: string }
> = {
  RECRUITER_NOT_FOUND: {
    status: HTTP_STATUS.NOT_FOUND,
    message: RECRUITER_ERROR_MESSAGES.RECRUITER_NOT_FOUND,
  },
  BAD_CREDENTIALS: {
    status: HTTP_STATUS.UNAUTHORIZED,
    message: RECRUITER_ERROR_MESSAGES.BAD_CREDENTIALS,
  },
  JOB_NOT_FOUND: {
    status: HTTP_STATUS.NOT_FOUND,
    message: RECRUITER_ERROR_MESSAGES.JOB_NOT_FOUND,
  },
  CLIENT_NOT_FOUND: {
    status: HTTP_STATUS.NOT_FOUND,
    message: RECRUITER_ERROR_MESSAGES.CLIENT_NOT_FOUND,
  },
  CANDIDATE_NOT_FOUND: {
    status: HTTP_STATUS.NOT_FOUND,
    message: RECRUITER_ERROR_MESSAGES.CANDIDATE_NOT_FOUND,
  },
};
