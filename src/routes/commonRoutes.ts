import express, { Router } from 'express';
import commonController from '../controllers/commonController';
import validateJWT from '../middlewares/validateJWT';

const CommonRouter: Router = express.Router();

CommonRouter.get('/', (req, res) => {
    res.status(200).json({ message: 'Successfully server up and running !' });
});

/**
 * @swagger
 * /getallcandidates:
 *   get:
 *     summary: Get all candidates - [Admin/Client]
 *     description: Fetches a list of all candidates from the database.
 *     tags:
 *       - Common
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched candidate list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 candidates:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "65a8d7f82c4a3f6f12345678"
 *                       email:
 *                         type: string
 *                         example: "john.doe@example.com"
 *                       firstName:
 *                         type: string
 *                         example: "John"
 *                       lastName:
 *                         type: string
 *                         example: "Doe"
 *                       mobileNumber:
 *                         type: string
 *                         example: "9876543210"
 *                       address:
 *                         type: string
 *                         example: "123 Street, New York"
 *                       dateOfBirth:
 *                         type: string
 *                         format: date
 *                         example: "1990-05-21"
 *                       gender:
 *                         type: string
 *                         example: "Male"
 *                       category:
 *                         type: string
 *                         example:
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:20:30.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-16T08:15:10.000Z"
 *       500:
 *         description: Internal server error while fetching candidates
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
 *                   example: "An error occurred while fetching candidates. Please try again later !"
 */
CommonRouter.get('/getallcandidates', validateJWT, commonController.getAllCandidates);

/**
 * @swagger
 * /getcandidatedetailsbyid/{candidateID}:
 *   get:
 *     summary: Get candidate details by ID - [Admin/Client]
 *     description: Retrieves complete details of a specific candidate by their ID. Requires JWT authentication.
 *     tags:
 *       - Common
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateID
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the candidate (24 character hexadecimal string)
 *         example: 65a8d7f82c4a3f6f12345678
 *     responses:
 *       200:
 *         description: Candidate details retrieved successfully
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
 *                   example: "Candidate details fetched successfully !"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65a8d7f82c4a3f6f12345678"
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
 *                       example: "123 Street, New York"
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                       example: "1990-05-21"
 *                     gender:
 *                       type: string
 *                       example: "Male"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:20:30.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-16T08:15:10.000Z"
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
 *                   example: "No token provided !"
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
 *         description: Internal server error occurred while fetching candidate details
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
 *                   example: "An error occurred while fetching candidate details. Please try again later !"
 */
CommonRouter.get('/getcandidatedetailsbyid/:candidateID', validateJWT, commonController.getCandidateById);

/**
 * @swagger
 * /getjobdetailsbyid/{jobId}:
 *   get:
 *     summary: Get job details by ID - [Public]
 *     description: Fetches detailed information about a specific job by its ID. Accessible to all authenticated users.
 *     tags:
 *       - Common
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the job to fetch
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Job details fetched successfully
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
 *                   example: "Job details fetched successfully !"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     clientId:
 *                       type: string
 *                       example: 507f191e810c19729de860ea
 *                     organizationName:
 *                       type: string
 *                       example: Tech Solutions Inc.
 *                     primaryContactFirstName:
 *                       type: string
 *                       example: John
 *                     primaryContactLastName:
 *                       type: string
 *                       example: Doe
 *                     logo:
 *                       type: string
 *                       example: https://iglobus-job-sethu.s3.amazonaws.com/clients/507f191e810c19729de860ea/logos/logo.png
 *                     jobTitle:
 *                       type: string
 *                       example: Senior Backend Developer
 *                     jobDescription:
 *                       type: string
 *                       example: Looking for an experienced backend developer with Node.js expertise
 *                     postStart:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-01-01T00:00:00.000Z
 *                     postEnd:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-03-01T00:00:00.000Z
 *                     noOfPositions:
 *                       type: number
 *                       example: 5
 *                     minimumSalary:
 *                       type: number
 *                       example: 800000
 *                     maximumSalary:
 *                       type: number
 *                       example: 1500000
 *                     jobType:
 *                       type: string
 *                       enum: [full-time, part-time, internship, freelance, contract]
 *                       example: full-time
 *                     jobLocation:
 *                       type: string
 *                       example: Hyderabad, India
 *                     minimumExperience:
 *                       type: number
 *                       example: 3
 *                     maximumExperience:
 *                       type: number
 *                       example: 7
 *                     status:
 *                       type: string
 *                       enum: [active, closed, drafted]
 *                       example: active
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-01-01T10:30:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-01-15T14:20:00.000Z
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
 *                   example: "No token provided !"
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
 *                   example: "Job not found !"
 *       500:
 *         description: Internal server error occurred while fetching job details
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
 *                   example: "An error occurred while fetching job details. Please try again later !"
 */
CommonRouter.get('/getjobdetailsbyid/:jobId', commonController.getJobById);

/**
 * @swagger
 * /getalljobs:
 *   get:
 *     summary: Get all active jobs [Public]
 *     description: Fetches all active jobs available for common. 
 *     tags:
 *       - Common
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
 *                       clientId:
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
CommonRouter.get('/getalljobs', commonController.getAllJobs);

/**
 * @swagger
 * /contactus:
 *   post:
 *     summary: Send contact us email
 *     description: Sends an email to the admin with contact details and message from a user or visitor.
 *     tags:
 *       - Common
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - customerEmail
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the person contacting
 *                 example: "John Doe"
 *               customerEmail:
 *                 type: string
 *                 format: email
 *                 description: Email address of the person contacting
 *                 example: "john.doe@example.com"
 *               subject:
 *                 type: string
 *                 description: Subject of the contact message
 *                 example: "Inquiry about job posting"
 *               message:
 *                 type: string
 *                 description: Detailed message or inquiry
 *                 example: "I would like to know more about the available positions."
 *     responses:
 *       200:
 *         description: Email sent successfully
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
 *                   example: "Email sent successfully"
 *       500:
 *         description: Internal server error while sending email
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
 *                   example: "Failed to send email. Please try again later !"
 */
CommonRouter.post('/contactus', commonController.sendContactUsMail);

export default CommonRouter;
