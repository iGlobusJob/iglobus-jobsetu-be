"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUS = exports.COMMON_ERROR_MESSAGES = exports.COMMON_SUCCESS_MESSAGES = void 0;
exports.COMMON_SUCCESS_MESSAGES = {
    CANDIDATE_FETCH_SUCCESS_MESSAGE: 'Candidate details fetched successfully !',
    JOB_FETCH_SUCCESS_MESSAGE: 'Job details fetched successfully !',
    JOBS_FETCHED_SUCCESS_MESSAGE: 'Jobs fetched successfully !',
};
exports.COMMON_ERROR_MESSAGES = {
    CANDIDATE_NOT_FOUND: 'Candidate not found !',
    CANDIDATES_FETCH_FAILED: 'An error occurred while fetching candidates list. Please try again later !',
    CANDIDATE_FETCH_FAILED: 'An error occurred while fetching candidate details. Please try again later !',
    JOB_NOT_FOUND: 'Job not found !',
    JOB_FETCH_FAILED: 'An error occurred while fetching job details. Please try again later !',
    JOBS_FETCH_FAILED: 'An error occurred while fetching jobs. Please try again later !',
};
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};
