import express, { Router } from 'express';
import candidateController from '../controllers/candidateController';
import validateRequest from '../middlewares/validateRequest';
import candidateJoinSchema from '../middlewares/schemas/candidateJoinSchema';
import validateOTPSchema from '../middlewares/schemas/validateOTPSchema';
import validateJWT from '../middlewares/validateJWT';
import candidatePermission from '../middlewares/candidatePermission';
import updateCandidateProfileSchema from '../middlewares/schemas/updateCandidateProfileSchema';
import upload from '../middlewares/uploadMiddleware';

const CandidateRouter: Router = express.Router();

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
CandidateRouter.post('/join', validateRequest(candidateJoinSchema), candidateController.candidateJoin);

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
CandidateRouter.post('/validateOTP', validateRequest(validateOTPSchema), candidateController.validateOTP);

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
 *                       example: "candidates/67924fb9a4834c73c16fbab4/resume_1701234567890_resume.pdf"
 *                     profileUrl:
 *                       type: string
 *                       description: Presigned URL to download resume (valid for 1 hour)
 *                       example: "https://iglobus-job-sethu.s3.amazonaws.com/candidates/67924fb9a4834c73c16fbab4/resume_1701234567890_resume.pdf?X-Amz-Algorithm=..."
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
CandidateRouter.get('/getcandidateprofile', validateJWT, candidatePermission, candidateController.getCandidateById);

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
 *                 description: Resume file (PDF, DOC, or DOCX, max 5MB)
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
 *                       example: "candidates/507f1f77bcf86cd799439011/resume_1701234567890_John_Doe_Resume.pdf"
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
 *                   example: "Invalid file type. Only PDF, DOC, and DOCX files are allowed."
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
 */
CandidateRouter.put('/updatecandidateprofile', validateJWT, candidatePermission, upload.single('profile'), validateRequest(updateCandidateProfileSchema), candidateController.updateCandidateProfile);

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
 *                       _id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       vendorId:
 *                         type: string
 *                         example: 507f191e810c19729de860ea
 *                       jobTitle:
 *                         type: string
 *                         example: Senior Backend Developer
 *                       jobDescription:
 *                         type: string
 *                         example: Looking for an experienced backend developer with Node.js expertise
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
CandidateRouter.get('/getalljobsbycandidate', validateJWT, candidateController.getAllJobsByCandidate);

export default CandidateRouter;
