import express, { Router } from 'express';
import recruiterController from '../controllers/recruiterController';
import validateJWT from '../middlewares/validateJWT';

const RecruiterRouter: Router = express.Router();

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
RecruiterRouter.post('/recruiter', recruiterController.recruiterLogin);

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
RecruiterRouter.get('/recruiter/jobs', validateJWT, recruiterController.getAllJobsByRecruiter);

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
RecruiterRouter.get('/recruiter/job/:jobId', validateJWT, recruiterController.getJobByIdByRecruiter);

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
RecruiterRouter.get('/recruiter/candidates', validateJWT, recruiterController.getAllCandidatesByRecruiter);

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
RecruiterRouter.get('/recruiter/candidate/:candidateId', validateJWT, recruiterController.getCandidateByIdByRecruiter);

/**
 * @swagger
 * /recruiter/getallassignedclientsbyrecruiter:
 *   get:
 *     summary: Get all clients assigned to a recruiter
 *     description: Fetches a list of all clients associated with the recruiter.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Recruiter
 *     responses:
 *       200:
 *         description: Clients fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 clients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "64f1c9e2a3b4c1234567890"
 *                       organizationName:
 *                         type: string
 *                         example: "Acme Corporation"
 *                       logo:
 *                         type: string
 *                         example: "https://example.com/logo.png"
 *                       email:
 *                         type: string
 *                         example: "contact@acme.com"
 *                       status:
 *                         type: string
 *                         example: "ACTIVE"
 *                       emailStatus:
 *                         type: string
 *                         example: "VERIFIED"
 *                       mobile:
 *                         type: string
 *                         example: "+91-9876543210"
 *                       mobileStatus:
 *                         type: string
 *                         example: "VERIFIED"
 *                       category:
 *                         type: string
 *                         example: "IT Services"
 *                       gstin:
 *                         type: string
 *                         example: "27ABCDE1234F1Z5"
 *                       panCard:
 *                         type: string
 *                         example: "ABCDE1234F"
 *                       primaryContact:
 *                         type: string
 *                         example: "John Doe"
 *                       secondaryContact:
 *                         type: string
 *                         example: "Jane Smith"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-01T10:30:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-10T15:45:00.000Z"
 *       500:
 *         description: Internal server error while fetching clients
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
 *                   example: "Failed to fetch clients"
 */
RecruiterRouter.get('/recruiter/getallassignedclientsbyrecruiter', validateJWT, recruiterController.getAllClientsByRecruiter);

export default RecruiterRouter;
