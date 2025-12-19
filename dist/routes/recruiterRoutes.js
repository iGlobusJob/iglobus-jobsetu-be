"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recruiterController_1 = __importDefault(require("../controllers/recruiterController"));
const validateJWT_1 = __importDefault(require("../middlewares/validateJWT"));
const RecruiterRouter = express_1.default.Router();
/**
 * @swagger
 * /recruiter:
 *   post:
 *     tags:
 *       - Recruiter
 *     summary: Recruiter login
 *     description: Login using recruiter email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: recruiter@company.com
 *               password:
 *                 type: string
 *                 example: Recruiter@123
 *     responses:
 *       200:
 *         description: Recruiter logged in successfully
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
 *                   example: Logged in successfully !
 *                 token:
 *                   type: string
 *       401:
 *         description: Bad credentials
 *       500:
 *         description: Login failed
 */
RecruiterRouter.post('/recruiter', recruiterController_1.default.recruiterLogin);
/**
 * @swagger
 * /recruiter/jobs:
 *   get:
 *     tags:
 *       - Recruiter
 *     summary: Get all jobs
 *     description: Fetch all jobs created or assigned to the recruiter.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Jobs fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch jobs
 */
RecruiterRouter.get('/recruiter/jobs', validateJWT_1.default, recruiterController_1.default.getAllJobsByRecruiter);
/**
 * @swagger
 * /recruiter/job/{jobId}:
 *   get:
 *     tags:
 *       - Recruiter
 *     summary: Get job details
 *     description: Fetch details of a specific job by ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     responses:
 *       200:
 *         description: Job details fetched successfully
 *       404:
 *         description: Job not found
 *       500:
 *         description: Failed to fetch job
 */
RecruiterRouter.get('/recruiter/job/:jobId', validateJWT_1.default, recruiterController_1.default.getJobByIdByRecruiter);
/**
 * @swagger
 * /recruiter/candidates:
 *   get:
 *     tags:
 *       - Recruiter
 *     summary: Get all candidates
 *     description: Fetch all candidates applied to recruiter jobs.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Candidates fetched successfully
 *       500:
 *         description: Failed to fetch candidates
 */
RecruiterRouter.get('/recruiter/candidates', validateJWT_1.default, recruiterController_1.default.getAllCandidatesByRecruiter);
/**
 * @swagger
 * /recruiter/candidate/{candidateId}:
 *   get:
 *     tags:
 *       - Recruiter
 *     summary: Get candidate details
 *     description: Fetch candidate details by ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     responses:
 *       200:
 *         description: Candidate details fetched successfully
 *       404:
 *         description: Candidate not found
 *       500:
 *         description: Failed to fetch candidate
 */
RecruiterRouter.get('/recruiter/candidate/:candidateId', validateJWT_1.default, recruiterController_1.default.getCandidateByIdByRecruiter);
exports.default = RecruiterRouter;
