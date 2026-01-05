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
RecruiterRouter.post(
  '/recruiter',
  recruiterController.recruiterLogin
);

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
RecruiterRouter.get(
  '/recruiter/jobs',
  validateJWT,
  recruiterController.getAllJobsByRecruiter
);

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
RecruiterRouter.get(
  '/recruiter/job/:jobId',
  validateJWT,
  recruiterController.getJobByIdByRecruiter
);

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
RecruiterRouter.get(
  '/recruiter/candidates',
  validateJWT,
  recruiterController.getAllCandidatesByRecruiter
);

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
RecruiterRouter.get(
  '/recruiter/candidate/:candidateId',
  validateJWT,
  recruiterController.getCandidateByIdByRecruiter
);

export default RecruiterRouter;
