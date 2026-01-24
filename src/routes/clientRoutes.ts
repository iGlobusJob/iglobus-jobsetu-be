import express, { Router } from 'express';
import clientController from '../controllers/clientController';
import validateRequest from '../middlewares/validateRequest';
import clientSchema from '../middlewares/schemas/clientSchema';
import clientLoginSchema from '../middlewares/schemas/clientLoginSchema';
import createJobSchema from '../middlewares/schemas/createJobSchema';
import updateJobSchema from '../middlewares/schemas/updateJobSchema';
import updateClientProfileSchema from '../middlewares/schemas/updateClientProfileSchema';
import sendOTPSchema from '../middlewares/schemas/sendOTPSchema';
import validateForgetPasswordOTPSchema from '../middlewares/schemas/validateForgetPasswordOTPSchema';
import updateClientPasswordSchema from '../middlewares/schemas/updateClientPasswordSchema';
import validateJWT from '../middlewares/validateJWT';
import clientPermission from '../middlewares/clientPermission';
import uploadLogo from '../middlewares/uploadLogoMiddleware';
import parseFormData from '../middlewares/parseFormData';

const ClientRouter: Router = express.Router();

/**
 * @swagger
 * /registerclient:
 *   post:
 *     summary: Register a new client with optional logo upload
 *     description: |
 *       Allows a new client to register with their organization details and contact information. Password will be securely hashed before storage. Logo upload is optional.
 *       
 *       **Important**: For nested objects (primaryContact, secondaryContact), send them as JSON strings in multipart form data.
 *       
 *       Example for primaryContact: `{"firstName":"John","lastName":"Doe"}`
 *     tags:
 *       - Client
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - primaryContact
 *               - organizationName
 *               - password
 *               - email
 *               - gstin
 *               - panCard
 *               - category
 *             properties:
 *               primaryContact:
 *                 type: string
 *                 description: 'JSON string of primary contact object (required). Example: {"firstName":"John","lastName":"Doe"}'
 *                 example: '{"firstName":"John","lastName":"Doe"}'
 *               organizationName:
 *                 type: string
 *                 description: Name of the client organization (2-100 characters, required)
 *                 example: XYZ Technologies Pvt Ltd
 *               password:
 *                 type: string
 *                 description: Password for client account (min 8 chars, must contain uppercase, lowercase, number and special character, required)
 *                 example: SecurePass@123
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the client (must be unique, will be converted to lowercase, required)
 *                 example: john.doe@xyztechnologies.com
 *               secondaryContact:
 *                 type: string
 *                 description: 'JSON string of secondary contact object (optional). Example: {"firstName":"Jane","lastName":"Smith"}'
 *                 example: '{"firstName":"Jane","lastName":"Smith"}'
 *               status:
 *                 type: string
 *                 enum: [registered, active, inactive]
 *                 description: Registration status of the client (optional)
 *                 example: registered
 *               emailStatus:
 *                 type: string
 *                 enum: [verified, notverified]
 *                 description: Email verification status (optional)
 *                 example: notverified
 *               mobile:
 *                 type: string
 *                 description: Mobile number of the client (must be 10 digits, optional)
 *                 example: "9876543210"
 *               mobileStatus:
 *                 type: string
 *                 enum: [verified, notverified]
 *                 description: Mobile verification status (optional)
 *                 example: notverified
 *               location:
 *                 type: string
 *                 description: Location of the client (optional)
 *                 example: Hyderabad
 *               gstin:
 *                 type: string
 *                 description: GST Identification Number (15 characters, uppercase letters and numbers only, required)
 *                 example: 22AAAAA0000A1Z5
 *               panCard:
 *                 type: string
 *                 description: PAN Card number (10 characters, format - AAAAA9999A, required)
 *                 example: ABCDE1234F
 *               category:
 *                 type: string
 *                 enum: [IT, Non-IT]
 *                 description: Client category (required)
 *                 example: IT
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Company logo image (JPEG, JPG, PNG, GIF, WEBP, BMP, SVG, TIFF, max 5MB, optional)
 *     responses:
 *       201:
 *         description: Client registered successfully
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
 *                   example: Client registered successfully !
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     email:
 *                       type: string
 *                       example: john.doe@xyztechnologies.com
 *                     organizationName:
 *                       type: string
 *                       example: XYZ Technologies Pvt Ltd
 *                     mobile:
 *                       type: string
 *                       example: "9876543210"
 *                     gstin:
 *                       type: string
 *                       example: 22AAAAA0000A1Z5
 *                     panCard:
 *                       type: string
 *                       example: ABCDE1234F
 *                     category:
 *                       type: string
 *                       example: IT
 *                     logo:
 *                       type: string
 *                       description: Public URL to the uploaded logo
 *                       example: "https://iglobus-job-sethu.s3.amazonaws.com/clients/507f1f77bcf86cd799439011/logos/logo_1701234567890_company_logo.png"
 *       409:
 *         description: Email already exists
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
 *                   example: Email already exists !
 *       400:
 *         description: Validation error - Missing mandatory fields or invalid file type
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
 *                         example: Email is required
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
 *                   example: Email already exists!
 */
ClientRouter.post('/registerclient', uploadLogo.single('logo'), parseFormData, validateRequest(clientSchema), clientController.clientRegistration);

/**
 * @swagger
 * /loginclient:
 *   post:
 *     summary: Client login
 *     description: Authenticates a client with email and password. Returns JWT token on successful login. Account must be active to login.
 *     tags:
 *       - Client
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
 *                 format: email
 *                 description: Email address of the client
 *                 example: john.doe@xyztechnologies.com
 *               password:
 *                 type: string
 *                 description: Password for the client account
 *                 example: SecurePass@123
 *     responses:
 *       200:
 *         description: Login Successfully
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
 *                   example: Login Successfully !
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT authentication token
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     client:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         organizationName:
 *                           type: string
 *                         status:
 *                           type: string
 *                         primaryContact:
 *                           type: object
 *                           properties:
 *                             firstName:
 *                               type: string
 *                             lastName:
 *                               type: string
 *                         category:
 *                           type: string
 *                           enum: [IT, Non-IT]
 *                           example: IT
 *       400:
 *         description: Validation error - Missing email or password
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
 *       401:
 *         description: Unauthorized - Invalid email or password
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
 *                   example: Bad Credentials!
 *       403:
 *         description: Forbidden - Account not activated by admin
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
 *                   example: Please wait for admin to activate your account
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
 *                   example: An error occurred during login. Please try again later.
 */
ClientRouter.post('/loginclient', validateRequest(clientLoginSchema), clientController.clientLogin);

/**
 * @swagger
 * /getclientprofile:
 *   get:
 *     summary: Get authenticated client's profile details
 *     description: Retrieves complete profile information of the currently authenticated client. The client ID is automatically extracted from the JWT token, so clients can only view their own profile. Requires JWT authentication.
 *     tags:
 *       - Client
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Client details retrieved successfully
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
 *                   example: Client details fetched successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     email:
 *                       type: string
 *                       example: john.doe@xyztechnologies.com
 *                     organizationName:
 *                       type: string
 *                       example: XYZ Technologies Pvt Ltd
 *                     status:
 *                       type: string
 *                       enum: [registered, active, inactive]
 *                       example: active
 *                     emailStatus:
 *                       type: string
 *                       enum: [verified, notverified]
 *                       example: verified
 *                     mobile:
 *                       type: string
 *                       example: "9876543210"
 *                     mobileStatus:
 *                       type: string
 *                       enum: [verified, notverified]
 *                       example: notverified
 *                     location:
 *                       type: string
 *                       example: Hyderabad
 *                     gstin:
 *                       type: string
 *                       example: 22AAAAA0000A1Z5
 *                     panCard:
 *                       type: string
 *                       example: ABCDE1234F
 *                     category:
 *                       type: string
 *                       enum: [IT, Non-IT]
 *                       example: IT
 *                     primaryContact:
 *                       type: object
 *                       properties:
 *                         firstName:
 *                           type: string
 *                           example: John
 *                         lastName:
 *                           type: string
 *                           example: Doe
 *                     secondaryContact:
 *                       type: object
 *                       properties:
 *                         firstName:
 *                           type: string
 *                           example: Jane
 *                         lastName:
 *                           type: string
 *                           example: Smith
 *                     logo:
 *                       type: string
 *                       description: Public URL to the company logo
 *                       example: "https://iglobus-job-sethu.s3.amazonaws.com/clients/507f1f77bcf86cd799439011/logos/logo_1701234567890_company_logo.png"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-11-13T10:30:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-11-13T10:30:00.000Z
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token, or client ID not found in token.
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
 *         description: Client not found
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
 *                   example: "Invalid Account !"
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
 *                   example: "An error occurred while fetching client details. Please try again later !"
 */
ClientRouter.get('/getclientprofile', validateJWT, clientPermission, clientController.getClientById);

/**
 * @swagger
 * /updateclientprofile:
 *   put:
 *     summary: Update client profile with optional logo upload
 *     description: |
 *       Allows an authenticated client to update their own profile. Client ID is extracted from the JWT token, so client can only update their own profile. Logo images are stored in AWS S3 under clients/{clientId}/logos/ folder and made publicly accessible.
 *       
 *       **Important**: For nested objects (primaryContact, secondaryContact), send them as JSON strings in multipart form data.
 *       
 *       Example for primaryContact: `{"firstName":"John","lastName":"Doe"}`
 *     tags:
 *       - Client
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               primaryContact:
 *                 type: string
 *                 description: 'JSON string of primary contact object. Example: {"firstName":"John","lastName":"Doe"}'
 *                 example: '{"firstName":"John","lastName":"Doe"}'
 *               organizationName:
 *                 type: string
 *                 description: Name of the client organization (2-100 characters)
 *                 example: Tech Solutions Inc.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: New password (min 8 characters, must include uppercase, lowercase, number, and special character)
 *                 example: NewPassword@123
 *               secondaryContact:
 *                 type: string
 *                 description: 'JSON string of secondary contact object. Example: {"firstName":"Jane","lastName":"Smith"}'
 *                 example: '{"firstName":"Jane","lastName":"Smith"}'
 *               mobile:
 *                 type: string
 *                 description: Mobile number (exactly 10 digits)
 *                 example: "9876543210"
 *               location:
 *                 type: string
 *                 description: Client location or address
 *                 example: Mumbai, Maharashtra
 *               gstin:
 *                 type: string
 *                 description: "GST Identification Number (format: 22AAAAA0000A1Z5)"
 *                 example: 27AABCT1234F1Z5
 *               panCard:
 *                 type: string
 *                 description: "PAN Card number (format: ABCDE1234F)"
 *                 example: ABCDE1234F
 *               category:
 *                 type: string
 *                 enum: [IT, Non-IT]
 *                 description: Client category
 *                 example: IT
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Company logo image (JPEG, JPG, PNG,  WEBP, BMP, SVG, TIFF, max 5MB)
 *     responses:
 *       200:
 *         description: Client profile updated successfully.
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
 *                   example: "Client profile updated successfully !"
 *                 data:
 *                   type: object
 *                   properties:
 *                     clientId:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     organizationName:
 *                       type: string
 *                       example: Tech Solutions Inc.
 *                     primaryContact:
 *                       type: object
 *                       properties:
 *                         firstName:
 *                           type: string
 *                           example: John
 *                         lastName:
 *                           type: string
 *                           example: Doe
 *                     secondaryContact:
 *                       type: object
 *                       properties:
 *                         firstName:
 *                           type: string
 *                           example: Jane
 *                         lastName:
 *                           type: string
 *                           example: Smith
 *                     mobile:
 *                       type: string
 *                       example: "9876543210"
 *                     location:
 *                       type: string
 *                       example: Mumbai, Maharashtra
 *                     gstin:
 *                       type: string
 *                       example: 27AABCT1234F1Z5
 *                     panCard:
 *                       type: string
 *                       example: ABCDE1234F
 *                     category:
 *                       type: string
 *                       enum: [IT, Non-IT]
 *                       example: IT
 *                     logo:
 *                       type: string
 *                       description: Public URL to the uploaded logo
 *                       example: "https://iglobus-job-sethu.s3.amazonaws.com/clients/507f1f77bcf86cd799439011/logos/logo_1701234567890_company_logo.png"
 *                     status:
 *                       type: string
 *                       example: active
 *                     emailStatus:
 *                       type: boolean
 *                       example: true
 *                     mobileStatus:
 *                       type: boolean
 *                       example: true
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-28T10:30:00.000Z"
 *       400:
 *         description: Validation error - invalid input data, no fields provided, or invalid file type.
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
 *                   example: "Invalid file type. Only image files (JPEG, JPG, PNG, GIF, WEBP, BMP, SVG, TIFF) are allowed."
 *       401:
 *         description: Unauthorized - invalid or missing JWT token, or client ID not found in token.
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
 *         description: Client not found.
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
 *                   example: "Invalid Account !"
 *       500:
 *         description: Internal server error occurred while updating client profile or uploading logo.
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
 *                   example: "An error occurred while uploading logo. Please try again later !"
 */
ClientRouter.put('/updateclientprofile', validateJWT, clientPermission, uploadLogo.single('logo'), parseFormData, validateRequest(updateClientProfileSchema), clientController.updateClientProfile);

/**
 * @swagger
 * /createjobbyclient:
 *   post:
 *     summary: Create a new job posting by client
 *     description: Allows an authenticated client to create a new job posting. The client ID is automatically extracted from the JWT token. Organization details are fetched from the client record and cannot be overridden.
 *     tags:
 *       - Client
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobTitle
 *             properties:
 *               jobTitle:
 *                 type: string
 *                 description: Title of the job position (required)
 *                 example: Senior Full Stack Developer
 *               jobDescription:
 *                 type: string
 *                 description: Detailed description of the job role and responsibilities
 *                 example: We are looking for an experienced Full Stack Developer to join our dynamic team.
 *               postStart:
 *                 type: string
 *                 format: date-time
 *                 description: Date when the job posting becomes active
 *                 example: 2025-01-01T00:00:00.000Z
 *               postEnd:
 *                 type: string
 *                 format: date-time
 *                 description: Date when the job posting expires (must be after postStart)
 *                 example: 2025-03-31T23:59:59.000Z
 *               noOfPositions:
 *                 type: integer
 *                 minimum: 1
 *                 description: Number of positions available (minimum 1)
 *                 example: 3
 *               minimumSalary:
 *                 type: number
 *                 minimum: 0
 *                 description: Minimum salary offered (cannot be negative)
 *                 example: 800000
 *               maximumSalary:
 *                 type: number
 *                 minimum: 0
 *                 description: Maximum salary offered (must be greater than minimumSalary)
 *                 example: 1500000
 *               jobType:
 *                 type: string
 *                 enum: [full-time, part-time, internship, freelance, contract]
 *                 description: Type of employment
 *                 example: full-time
 *               jobLocation:
 *                 type: string
 *                 description: Location where the job is based
 *                 example: Hyderabad, India
 *               minimumExperience:
 *                 type: number
 *                 minimum: 0
 *                 description: Minimum years of experience required (cannot be negative)
 *                 example: 3
 *               maximumExperience:
 *                 type: number
 *                 minimum: 0
 *                 description: Maximum years of experience (must be >= minimumExperience)
 *                 example: 7
 *               status:
 *                 type: string
 *                 enum: [active, closed, drafted]
 *                 description: Status of the job posting (defaults to 'drafted')
 *                 example: drafted
 *     responses:
 *       201:
 *         description: Job created successfully.
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
 *                   example: "Job created successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64fbf1234567890abcdef123"
 *                     jobTitle:
 *                       type: string
 *                       example: "Senior Full Stack Developer"
 *                     jobDescription:
 *                       type: string
 *                       example: "We are looking for an experienced Full Stack Developer..."
 *                     clientId:
 *                       type: string
 *                       example: "64fbc9876543210abcdef456"
 *                     organizationName:
 *                       type: string
 *                       example: "Acme Corp"
 *                     status:
 *                       type: string
 *                       example: "drafted"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-04T12:34:56.789Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-04T12:34:56.789Z"
 *       400:
 *         description: Bad request - validation errors.
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
 *                   example: "Job title is required"
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token.
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
 *         description: Internal server error occurred while creating the job.
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
 *                   example: "An error occurred while creating the job. Please try again later!"
 *
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
ClientRouter.post('/createjobbyclient', validateJWT, clientPermission, validateRequest(createJobSchema), clientController.createJobByClient);

/**
 * @swagger
 * /getjobbyclient/{jobId}:
 *   get:
 *     summary: Get a specific job by ID
 *     description: Allows an authenticated client to fetch details of a specific job by its ID. Client can only access jobs they have created. The client ID is extracted from the JWT token for authorization.
 *     tags:
 *       - Client
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
 *         description: Job details fetched successfully.
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
 *         description: Unauthorized - Invalid or missing JWT token, or client ID not found in token.
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
 *         description: Job not found or client is not authorized to access this job.
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
 *         description: Internal server error occurred while fetching the job.
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
ClientRouter.get('/getjobbyclient/:jobId', validateJWT, clientPermission, clientController.getJobByClient);

/**
 * @swagger
 * /updatejobbyclient:
 *   put:
 *     summary: Update an existing job posting by client
 *     description: Allows an authenticated client to update their existing job posting. The client ID is automatically extracted from the JWT token. Client can only update jobs they created. Job ID is required in the request body along with fields to update.
 *     tags:
 *       - Client
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
 *                 description: Unique identifier of the job to update (required)
 *                 example: 507f1f77bcf86cd799439011
 *               jobTitle:
 *                 type: string
 *                 description: Title of the job position
 *                 example: Senior Full Stack Developer
 *               jobDescription:
 *                 type: string
 *                 description: Detailed description of the job role (minimum 50 characters if provided)
 *                 example: We are looking for an experienced Full Stack Developer to join our dynamic team.
 *               postStart:
 *                 type: string
 *                 format: date-time
 *                 description: Date when the job posting becomes active
 *                 example: 2025-01-01T00:00:00.000Z
 *               postEnd:
 *                 type: string
 *                 format: date-time
 *                 description: Date when the job posting expires (must be after postStart)
 *                 example: 2025-03-31T23:59:59.000Z
 *               noOfPositions:
 *                 type: integer
 *                 minimum: 1
 *                 description: Number of positions available (minimum 1)
 *                 example: 3
 *               minimumSalary:
 *                 type: number
 *                 minimum: 0
 *                 description: Minimum salary offered (cannot be negative)
 *                 example: 800000
 *               maximumSalary:
 *                 type: number
 *                 minimum: 0
 *                 description: Maximum salary offered (must be greater than minimumSalary)
 *                 example: 1500000
 *               jobType:
 *                 type: string
 *                 enum: [full-time, part-time, internship, freelance, contract]
 *                 description: Type of employment
 *                 example: full-time
 *               jobLocation:
 *                 type: string
 *                 description: Location where the job is based
 *                 example: Hyderabad, India
 *               minimumExperience:
 *                 type: number
 *                 minimum: 0
 *                 description: Minimum years of experience required (cannot be negative)
 *                 example: 3
 *               maximumExperience:
 *                 type: number
 *                 minimum: 0
 *                 description: Maximum years of experience (must be >= minimumExperience)
 *                 example: 7
 *               status:
 *                 type: string
 *                 enum: [active, closed, drafted]
 *                 description: Status of the job posting
 *                 example: active
 *     responses:
 *       200:
 *         description: Job updated successfully.
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
 *                   example: "Job updated successfully !"
 *                 data:
 *                   type: object
 *                   description: The updated job object
 *                   properties:
 *                     jobId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     clientId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439012
 *                     jobTitle:
 *                       type: string
 *                       example: Senior Full Stack Developer
 *                     jobDescription:
 *                       type: string
 *                       example: We are looking for an experienced Full Stack Developer to join our dynamic team.
 *                     postStart:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-01-01T00:00:00.000Z
 *                     postEnd:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-03-31T23:59:59.000Z
 *                     noOfPositions:
 *                       type: integer
 *                       example: 3
 *                     minimumSalary:
 *                       type: number
 *                       example: 800000
 *                     maximumSalary:
 *                       type: number
 *                       example: 1500000
 *                     jobType:
 *                       type: string
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
 *                       example: active
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-01-01T10:30:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-01-15T14:20:00.000Z
 *       400:
 *         description: Bad request - validation errors.
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
 *                   example: "Job ID is required"
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token.
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
 *         description: Job not found or client not authorized to update this job.
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
 *                   example: "Job not found or you are not authorized to update this job !"
 *       500:
 *         description: Internal server error occurred while updating the job.
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
 *                   example: "An error occurred while updating the job. Please try again later !"
 */
ClientRouter.put('/updatejobbyclient', validateJWT, clientPermission, validateRequest(updateJobSchema), clientController.updateJobByClient);

/**
 * @swagger
 * /sendOTP:
 *   post:
 *     summary: Send OTP for forget password
 *     description: Generates a 5-digit OTP and sends it to the client's email address for password reset. OTP is valid for 10 minutes.
 *     tags:
 *       - Client
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
 *                 description: Email address of the client
 *                 example: john.doe@xyztechnologies.com
 *     responses:
 *       200:
 *         description: OTP sent successfully to the client's email
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
 *                   example: "OTP sent successfully to your email !"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: john.doe@xyztechnologies.com
 *       404:
 *         description: Email not found in the system
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
 *                   example: "Email address not found in our records !"
 *       400:
 *         description: Validation error - Invalid email format
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
 *                   example: "Validation failed"
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
 *                   example: "An error occurred while generating OTP. Please try again later !"
 */
ClientRouter.post('/sendOTP', validateRequest(sendOTPSchema), clientController.sendForgetPasswordOTP);

/**
 * @swagger
 * /clientvalidateOTP:
 *   post:
 *     summary: Validate OTP for forget password
 *     description: Validates the OTP sent to the client's email. OTP must match and must not be expired (valid for 10 minutes).
 *     tags:
 *       - Client
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
 *                 description: Email address of the client
 *                 example: john.doe@xyztechnologies.com
 *               otp:
 *                 type: string
 *                 description: 5-digit OTP received in email
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: OTP validated successfully
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
 *                   example: "OTP validated successfully !"
 *       400:
 *         description: Invalid or expired OTP
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
 *                   example: "Invalid OTP. Please try again !"
 *             examples:
 *               invalidOTP:
 *                 value:
 *                   success: false
 *                   message: "Invalid OTP. Please try again !"
 *               expiredOTP:
 *                 value:
 *                   success: false
 *                   message: "OTP has expired. Please request a new one !"
 *       404:
 *         description: Email not found in the system
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
 *                   example: "Email address not found in our records !"
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
 *                   example: "An error occurred while validating OTP. Please try again later !"
 */
ClientRouter.post('/clientvalidateOTP', validateRequest(validateForgetPasswordOTPSchema), clientController.validateForgetPasswordOTP);

/**
 * @swagger
 * /updateClientPassword:
 *   put:
 *     summary: Update client password after OTP validation
 *     description: Updates the client's password after successful OTP validation. Password must meet security requirements (min 8 chars, uppercase, lowercase, number, special character). Both password fields must match.
 *     tags:
 *       - Client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *               - reEnterNewPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the client
 *                 example: john.doe@xyztechnologies.com
 *               newPassword:
 *                 type: string
 *                 description: New password (min 8 chars, must contain uppercase, lowercase, number, and special character)
 *                 example: "NewSecure@123"
 *               reEnterNewPassword:
 *                 type: string
 *                 description: Re-enter the new password (must match newPassword)
 *                 example: "NewSecure@123"
 *     responses:
 *       200:
 *         description: Password updated successfully
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
 *                   example: "Password updated successfully !"
 *       400:
 *         description: Validation error - passwords don't match or invalid format
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
 *                   example: "Passwords do not match"
 *       404:
 *         description: Email not found in the system
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
 *                   example: "Email address not found in our records !"
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
 *                   example: "An error occurred while updating password. Please try again later !"
 */
ClientRouter.put('/updateClientPassword', validateRequest(updateClientPasswordSchema), clientController.updateClientPassword);

export default ClientRouter;
