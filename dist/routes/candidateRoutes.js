"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const candidateController_1 = __importDefault(require("../controllers/candidateController"));
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const candidateJoinSchema_1 = __importDefault(require("../middlewares/schemas/candidateJoinSchema"));
const validateOTPSchema_1 = __importDefault(require("../middlewares/schemas/validateOTPSchema"));
const jobIdSchema_1 = __importDefault(require("../middlewares/schemas/jobIdSchema"));
const validateJWT_1 = __importDefault(require("../middlewares/validateJWT"));
const candidatePermission_1 = __importDefault(require("../middlewares/candidatePermission"));
const updateCandidateProfileSchema_1 = __importDefault(require("../middlewares/schemas/updateCandidateProfileSchema"));
const uploadFieldsMiddleware_1 = __importDefault(require("../middlewares/uploadFieldsMiddleware"));
const CandidateRouter = express_1.default.Router();
/**
 * @swagger
 * /join:
 *   post:
 *     summary: Candidate registration or login
 *     description: Allows a candidate to register or login using their email. Generates and sends a 5-digit OTP for verification. If candidate exists, updates OTP; otherwise creates new candidate.
 *     tags:
 *       - Candidate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the candidate (will be converted to lowercase)
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: OTP generated and sent successfully !
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully !
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *       400:
 *         description: Validation error - Invalid or missing email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 missingFields:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: email
 *                       message:
 *                         type: string
 *                         example: Please provide a valid email address
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while generating OTP. Please try again later.
 */
CandidateRouter.post('/join', (0, validateRequest_1.default)(candidateJoinSchema_1.default), candidateController_1.default.candidateJoin);
/**
 * @swagger
 * /validateotp:
 *   post:
 *     summary: Validate OTP for candidate
 *     description: Validates the OTP sent to candidate's email. Checks if OTP is expired and matches the OTP in database.
 *     tags:
 *       - Candidate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the candidate
 *                 example: john.doe@example.com
 *               otp:
 *                 type: string
 *                 description: 5-digit OTP received by the candidate
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: OTP validation successfully !
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP Validation successfully !
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT authentication token
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     candidate:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439011
 *                         email:
 *                           type: string
 *                           example: john.doe@example.com
 *       400:
 *         description: Bad Request - OTP expired or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Password Expired, Please join again
 *             examples:
 *               otpExpired:
 *                 value:
 *                   success: false
 *                   message: Password Expired, Please join again
 *               invalidOTP:
 *                 value:
 *                   success: false
 *                   message: Invalid OTP !
 *               validationError:
 *                 value:
 *                   success: false
 *                   message: Validation failed
 *                   missingFields:
 *                     - field: otp
 *                       message: OTP must be exactly 5 digits
 *       404:
 *         description: Candidate not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Candidate not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred during OTP validation. Please try again later.
 */
CandidateRouter.post('/validateOTP', (0, validateRequest_1.default)(validateOTPSchema_1.default), candidateController_1.default.validateOTP);
/**
 * @swagger
 * /getcandidateprofile:
 *   get:
 *     summary: Get authenticated candidate's profile details
 *     tags:
 *       - Candidate
 *     description: Retrieves complete profile information of the currently authenticated candidate. The candidate ID is automatically extracted from the JWT token, so candidates can only view their own profile. Requires JWT authentication.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Candidate details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Candidate fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 67924fb9a4834c73c16fbab4
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     mobileNumber:
 *                       type: string
 *                       example: "9876543210"
 *                     address:
 *                       type: string
 *                       example: "123 MG Road, Bangalore"
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                       example: "1990-01-01"
 *                     gender:
 *                       type: string
 *                       example: Male
 *                     category:
 *                       type: string
 *                       enum: [IT, Non-IT]
 *                       example: IT
 *                     profile:
 *                       type: string
 *                       description: S3 path to uploaded resume
 *                       example: "candidates/67924fb9a4834c73c16fbab4/resumes/resume_1701234567890_resume.pdf"
 *                     profileUrl:
 *                       type: string
 *                       description: Presigned URL to download resume (valid for 1 hour)
 *                       example: "https://iglobus-job-sethu.s3.amazonaws.com/candidates/67924fb9a4834c73c16fbab4/resumes/resume_1701234567890_resume.pdf?X-Amz-Algorithm=..."
 *                     profilePicture:
 *                       type: string
 *                       description: S3 path to uploaded profile picture
 *                       example: "candidates/67924fb9a4834c73c16fbab4/profilepictures/profilepicture_1701234567890_profile.jpg"
 *                     profilePictureUrl:
 *                       type: string
 *                       description: Presigned URL to view profile picture (valid for 1 hour)
 *                       example: "https://iglobus-job-sethu.s3.amazonaws.com/candidates/67924fb9a4834c73c16fbab4/profilepictures/profilepicture_1701234567890_profile.jpg?X-Amz-Algorithm=..."
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T08:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-16T10:15:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token, or candidate ID not found in token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired token"
 *       404:
 *         description: Candidate not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Candidate not found
 *       500:
 *         description: Server error while fetching candidate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to fetch candidate
 */
CandidateRouter.get('/getcandidateprofile', validateJWT_1.default, candidatePermission_1.default, candidateController_1.default.getCandidateById);
/**
 * @swagger
 * /updatecandidateprofile:
 *   put:
 *     summary: Update logged-in candidate profile with optional resume upload
 *     description: Allows authenticated candidate to update their profile information and optionally upload a resume (PDF, DOC, or DOCX). Resume is stored in AWS S3 under candidates/{candidateId}/ folder.
 *     tags:
 *       - Candidate
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the candidate
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: Last name of the candidate
 *                 example: Doe
 *               mobileNumber:
 *                 type: string
 *                 description: Mobile number (10 digits)
 *                 example: "9876543210"
 *               address:
 *                 type: string
 *                 description: Address of the candidate
 *                 example: "123 Main Street, New York"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: Date of birth
 *                 example: "1995-07-15"
 *               gender:
 *                 type: string
 *                 description: Gender of the candidate
 *                 example: Male
 *               category:
 *                 type: string
 *                 enum: [IT, Non-IT]
 *                 description: Category of the candidate
 *                 example: IT
 *               profile:
 *                 type: string
 *                 format: binary
 *                 description: Resume file (PDF, DOC, or DOCX, max 10MB)
 *               profilepicture:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture (JPEG, JPG, PNG, GIF, or WEBP, max 10MB)
 *               designation:
 *                 type: string
 *                 description: Designation of the candidate
 *                 example: "Software Engineer"
 *               experience:
 *                 type: integer
 *                 description: Experience of the candidate
 *                 example: 5
 *     responses:
 *       200:
 *         description: Candidate profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Candidate details updated successfully !"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     mobileNumber:
 *                       type: string
 *                       example: "9876543210"
 *                     address:
 *                       type: string
 *                       example: "123 Main Street, New York"
 *                     dateOfBirth:
 *                       type: string
 *                       example: "1995-07-15"
 *                     gender:
 *                       type: string
 *                       example: "Male"
 *                     category:
 *                       type: string
 *                       enum: [IT, Non-IT]
 *                       example: "IT"
 *                     profile:
 *                       type: string
 *                       description: S3 path to uploaded resume
 *                       example: "candidates/507f1f77bcf86cd799439011/resumes/resume_1701234567890_John_Doe_Resume.pdf"
 *                     profilePicture:
 *                       type: string
 *                       description: S3 path to uploaded profile picture
 *                       example: "candidates/507f1f77bcf86cd799439011/profilepictures/profilepicture_1701234567890_profile.jpg"
 *       400:
 *         description: Invalid file type or file too large
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid file type for resume. Only PDF, DOC, and DOCX files are allowed."
 *             examples:
 *               invalidResume:
 *                 value:
 *                   success: false
 *                   message: "Invalid file type for resume. Only PDF, DOC, and DOCX files are allowed."
 *               invalidProfilePicture:
 *                 value:
 *                   success: false
 *                   message: "Invalid file type for profile picture. Only JPEG, JPG, PNG, GIF, and WEBP images are allowed."
 *               fileTooLarge:
 *                 value:
 *                   success: false
 *                   message: "File too large"
 *       401:
 *         description: Unauthorized – Candidate ID missing in token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid candidate ID. Access denied !"
 *       404:
 *         description: Candidate not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Candidate not found !"
 *       500:
 *         description: Internal server error or resume upload failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while uploading resume. Please try again later !"
 *             examples:
 *               resumeUploadFailed:
 *                 value:
 *                   success: false
 *                   message: "An error occurred while uploading resume. Please try again later !"
 *               profilePictureUploadFailed:
 *                 value:
 *                   success: false
 *                   message: "An error occurred while uploading profile picture. Please try again later !"
 */
CandidateRouter.put('/updatecandidateprofile', validateJWT_1.default, candidatePermission_1.default, uploadFieldsMiddleware_1.default.fields([{ name: 'profile', maxCount: 1 }, { name: 'profilepicture', maxCount: 1 }]), (0, validateRequest_1.default)(updateCandidateProfileSchema_1.default), candidateController_1.default.updateCandidateProfile);
/**
 * @swagger
 * /getalljobsbycandidate:
 *   get:
 *     summary: Get all active jobs for candidates
 *     description: Fetches all active jobs available for candidates. Returns jobs sorted by creation date (newest first). Only jobs with 'active' status are returned. Requires JWT authentication.
 *     tags:
 *       - Candidate
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Jobs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Jobs fetched successfully !"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       clientId:
 *                         type: string
 *                         example: 507f191e810c19729de860ea
 *                       organizationName:
 *                         type: string
 *                         example: "Tech Corp"
 *                       logo:
 *                         type: string
 *                         format: uri
 *                         example: "https://cdn.example.com/logos/company.png"
 *                       jobTitle:
 *                         type: string
 *                         example: Senior Backend Developer
 *                       jobDescription:
 *                         type: string
 *                         example: Looking for an experienced backend developer
 *                       postStart:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-01-01T00:00:00.000Z
 *                       postEnd:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-01T00:00:00.000Z
 *                       noOfPositions:
 *                         type: number
 *                         example: 5
 *                       minimumSalary:
 *                         type: number
 *                         example: 800000
 *                       maximumSalary:
 *                         type: number
 *                         example: 1500000
 *                       jobType:
 *                         type: string
 *                         enum: [full-time, part-time, internship, freelance, contract]
 *                         example: full-time
 *                       jobLocation:
 *                         type: string
 *                         example: Hyderabad, India
 *                       minimumExperience:
 *                         type: number
 *                         example: 3
 *                       maximumExperience:
 *                         type: number
 *                         example: 7
 *                       status:
 *                         type: string
 *                         enum: [active, closed, drafted]
 *                         example: active
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-01-01T10:30:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-01-15T14:20:00.000Z
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired token"
 *       500:
 *         description: Internal server error occurred while fetching jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching jobs. Please try again later !"
 */
CandidateRouter.get('/getalljobsbycandidate', validateJWT_1.default, candidateController_1.default.getAllJobsByCandidate);
/**
 * @swagger
 * /applytojob:
 *   post:
 *     summary: Apply to a job (Candidate only)
 *     description: Allows a candidate to apply for a job. Creates a record in candidatejobs collection with isJobApplied set to true. Requires JWT authentication and candidate permissions.
 *     tags:
 *       - Candidate
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 description: MongoDB ObjectId of the job (24 character hexadecimal string)
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Job applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Job applied successfully !
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     candidateId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439012
 *                     jobId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     isJobApplied:
 *                       type: boolean
 *                       example: true
 *                     isJobSaved:
 *                       type: boolean
 *                       example: false
 *                     appliedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-12-15T10:30:00.000Z
 *       400:
 *         description: Bad Request - Invalid job ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *       401:
 *         description: Unauthorized - No token provided or invalid candidate credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid candidate ID. Access denied !
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Job not found !
 *       409:
 *         description: Already applied to this job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: You have already applied to this job !
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while applying to job. Please try again later !
 */
CandidateRouter.post('/applytojob', validateJWT_1.default, candidatePermission_1.default, (0, validateRequest_1.default)(jobIdSchema_1.default), candidateController_1.default.applyToJob);
/**
 * @swagger
 * /savejob:
 *   post:
 *     summary: Save a job for later (Candidate only)
 *     description: Allows a candidate to save a job for later viewing. Creates or updates a record in candidatejobs collection with isJobSaved set to true. Requires JWT authentication and candidate permissions.
 *     tags:
 *       - Candidate
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 description: MongoDB ObjectId of the job (24 character hexadecimal string)
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Job saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Job saved successfully !
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     candidateId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439012
 *                     jobId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     isJobSaved:
 *                       type: boolean
 *                       example: true
 *                     isJobApplied:
 *                       type: boolean
 *                       example: false
 *                     savedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-12-15T10:30:00.000Z
 *       400:
 *         description: Bad Request - Invalid job ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Job not found !
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while saving job. Please try again later !
 */
CandidateRouter.post('/savejob', validateJWT_1.default, candidatePermission_1.default, (0, validateRequest_1.default)(jobIdSchema_1.default), candidateController_1.default.saveJob);
/**
 * @swagger
 * /unsavejob:
 *   put:
 *     summary: Unsave a previously saved job (Candidate only)
 *     description: Allows a candidate to unsave a job. Updates the candidatejobs record by setting isJobSaved to false. Requires JWT authentication and candidate permissions.
 *     tags:
 *       - Candidate
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 description: MongoDB ObjectId of the job (24 character hexadecimal string)
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Job unsaved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Job unsaved successfully !
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     candidateId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439012
 *                     jobId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     isJobSaved:
 *                       type: boolean
 *                       example: false
 *                     isJobApplied:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Bad Request - Invalid job ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *       404:
 *         description: Job not saved yet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Job is not saved yet !
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while unsaving job. Please try again later !
 */
CandidateRouter.put('/unsavejob', validateJWT_1.default, candidatePermission_1.default, (0, validateRequest_1.default)(jobIdSchema_1.default), candidateController_1.default.unsaveJob);
/**
 * @swagger
 * /getmyjobs:
 *   get:
 *     summary: Get all jobs saved or applied by candidate (Candidate only)
 *     description: Retrieves all jobs from candidatejobs collection for the logged-in candidate, including both saved and applied jobs. Returns complete job details with status flags. Requires JWT authentication and candidate permissions.
 *     tags:
 *       - Candidate
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: My jobs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: My jobs fetched successfully !
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       candidateId:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439012
 *                       jobId:
 *                         type: object
 *                         description: Populated job details
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: 507f1f77bcf86cd799439013
 *                           jobTitle:
 *                             type: string
 *                             example: Senior Software Engineer
 *                           organizationName:
 *                             type: string
 *                             example: Tech Corp
 *                           jobLocation:
 *                             type: string
 *                             example: Bangalore
 *                           minimumSalary:
 *                             type: number
 *                             example: 1000000
 *                           maximumSalary:
 *                             type: number
 *                             example: 1500000
 *                       isJobSaved:
 *                         type: boolean
 *                         example: true
 *                       isJobApplied:
 *                         type: boolean
 *                         example: false
 *                       savedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-12-15T10:30:00.000Z
 *                       appliedAt:
 *                         type: string
 *                         format: date-time
 *                         example: null
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-12-15T10:30:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-12-15T10:30:00.000Z
 *       401:
 *         description: Unauthorized - No token provided or invalid candidate credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid candidate ID. Access denied !
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: An error occurred while fetching my jobs. Please try again later !
 */
CandidateRouter.get('/getmyjobs', validateJWT_1.default, candidatePermission_1.default, candidateController_1.default.getMyJobs);
exports.default = CandidateRouter;
