import express, { Router } from 'express';
import vendorController from '../controllers/vendorController';
import validateRequest from '../middlewares/validateRequest';
import vendorSchema from '../middlewares/schemas/vendorSchema';
import vendorLoginSchema from '../middlewares/schemas/vendorLoginSchema';
import createJobSchema from '../middlewares/schemas/createJobSchema';
import updateJobSchema from '../middlewares/schemas/updateJobSchema';
import updateVendorProfileSchema from '../middlewares/schemas/updateVendorProfileSchema';
import validateJWT from '../middlewares/validateJWT';
import vendorPermission from '../middlewares/vendorPermission';
import uploadLogo from '../middlewares/uploadLogoMiddleware';
import parseFormData from '../middlewares/parseFormData';

const VendorRouter: Router = express.Router();

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
 *       - Vendor
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
 *                 description: Name of the vendor organization (2-100 characters, required)
 *                 example: XYZ Technologies Pvt Ltd
 *               password:
 *                 type: string
 *                 description: Password for vendor account (min 8 chars, must contain uppercase, lowercase, number and special character, required)
 *                 example: SecurePass@123
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the vendor (must be unique, will be converted to lowercase, required)
 *                 example: john.doe@xyztechnologies.com
 *               secondaryContact:
 *                 type: string
 *                 description: 'JSON string of secondary contact object (optional). Example: {"firstName":"Jane","lastName":"Smith"}'
 *                 example: '{"firstName":"Jane","lastName":"Smith"}'
 *               status:
 *                 type: string
 *                 enum: [registered, active, inactive]
 *                 description: Registration status of the vendor (optional)
 *                 example: registered
 *               emailStatus:
 *                 type: string
 *                 enum: [verified, notverified]
 *                 description: Email verification status (optional)
 *                 example: notverified
 *               mobile:
 *                 type: string
 *                 description: Mobile number of the vendor (must be 10 digits, optional)
 *                 example: "9876543210"
 *               mobileStatus:
 *                 type: string
 *                 enum: [verified, notverified]
 *                 description: Mobile verification status (optional)
 *                 example: notverified
 *               location:
 *                 type: string
 *                 description: Location of the vendor (optional)
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
 *                 description: Vendor category (required)
 *                 example: IT
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Company logo image (JPEG, JPG, PNG, GIF, WEBP, BMP, SVG, TIFF, max 5MB, optional)
 *     responses:
 *       201:
 *         description: Vendor registered successfully
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
 *                   example: Vendor registered successfully !
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
VendorRouter.post('/registerclient', uploadLogo.single('logo'), parseFormData, validateRequest(vendorSchema), vendorController.vendorRegistration);

/**
 * @swagger
 * /loginvendor:
 *   post:
 *     summary: Vendor login
 *     description: Authenticates a vendor with email and password. Returns JWT token on successful login. Account must be active to login.
 *     tags:
 *       - Vendor
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
 *                 description: Email address of the vendor
 *                 example: john.doe@xyztechnologies.com
 *               password:
 *                 type: string
 *                 description: Password for the vendor account
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
 *                   example: Login Successfully!
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT authentication token
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     vendor:
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
VendorRouter.post('/loginvendor', validateRequest(vendorLoginSchema), vendorController.vendorLogin);

/**
 * @swagger
 * /getvendorprofile:
 *   get:
 *     summary: Get authenticated vendor's profile details
 *     description: Retrieves complete profile information of the currently authenticated vendor. The vendor ID is automatically extracted from the JWT token, so vendors can only view their own profile. Requires JWT authentication.
 *     tags:
 *       - Vendor
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor details retrieved successfully
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
 *                   example: Vendor details fetched successfully!
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
 *         description: Unauthorized - Invalid or missing JWT token, or vendor ID not found in token.
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
 *         description: Vendor not found
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
 *                   example: "An error occurred while fetching vendor details. Please try again later !"
 */
VendorRouter.get('/getvendorprofile', validateJWT, vendorPermission, vendorController.getVendorById);

/**
 * @swagger
 * /updatevendorprofile:
 *   put:
 *     summary: Update vendor profile with optional logo upload
 *     description: |
 *       Allows an authenticated vendor to update their own profile. Vendor ID is extracted from the JWT token, so vendors can only update their own profile. Logo images are stored in AWS S3 under clients/{vendorId}/logos/ folder and made publicly accessible.
 *       
 *       **Important**: For nested objects (primaryContact, secondaryContact), send them as JSON strings in multipart form data.
 *       
 *       Example for primaryContact: `{"firstName":"John","lastName":"Doe"}`
 *     tags:
 *       - Vendor
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
 *                 description: Name of the vendor organization (2-100 characters)
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
 *                 description: Vendor location or address
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
 *                 description: Vendor category
 *                 example: IT
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Company logo image (JPEG, JPG, PNG, GIF, WEBP, BMP, SVG, TIFF, max 5MB)
 *     responses:
 *       200:
 *         description: Vendor profile updated successfully.
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
 *                   example: "Vendor profile updated successfully !"
 *                 data:
 *                   type: object
 *                   properties:
 *                     vendorId:
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
 *         description: Unauthorized - invalid or missing JWT token, or vendor ID not found in token.
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
 *         description: Vendor not found.
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
 *         description: Internal server error occurred while updating vendor profile or uploading logo.
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
VendorRouter.put('/updatevendorprofile', validateJWT, vendorPermission, uploadLogo.single('logo'), parseFormData, validateRequest(updateVendorProfileSchema), vendorController.updateVendorProfile);

/**
 * @swagger
 * /createjobbyvendor:
 *   post:
 *     summary: Create a new job posting by vendor
 *     description: Allows an authenticated vendor to create a new job posting. The vendor ID is automatically extracted from the JWT token. Organization details are fetched from the vendor record and cannot be overridden.
 *     tags:
 *       - Vendor
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
 *                     vendorId:
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
VendorRouter.post('/createjobbyvendor', validateJWT, vendorPermission, validateRequest(createJobSchema), vendorController.createJobByVendor);

/**
 * @swagger
 * /getalljobsbyclient:
 *   get:
 *     summary: Get all jobs created by vendor
 *     description: Retrieves all job postings created by the authenticated vendor. The vendor ID is automatically extracted from the JWT token. Jobs are sorted by creation date (newest first).
 *     tags:
 *       - Vendor
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Jobs fetched successfully.
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
 *                       vendorId:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439012
 *                       jobTitle:
 *                         type: string
 *                         example: Senior Full Stack Developer
 *                       jobDescription:
 *                         type: string
 *                         example: We are looking for an experienced Full Stack Developer to join our dynamic team.
 *                       postStart:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-01-01T00:00:00.000Z
 *                       postEnd:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-03-31T23:59:59.000Z
 *                       noOfPositions:
 *                         type: integer
 *                         example: 3
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
 *                       id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
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
 *         description: Internal server error occurred while fetching jobs.
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
VendorRouter.get('/getalljobsbyclient', validateJWT, vendorPermission, vendorController.getAllJobsByVendor);

/**
 * @swagger
 * /getjobbyvendor/{jobId}:
 *   get:
 *     summary: Get a specific job by ID
 *     description: Allows an authenticated vendor to fetch details of a specific job by its ID. Vendor can only access jobs they have created. The vendor ID is extracted from the JWT token for authorization.
 *     tags:
 *       - Vendor
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
 *                     vendorId:
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
 *         description: Unauthorized - Invalid or missing JWT token, or vendor ID not found in token.
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
 *         description: Job not found or vendor is not authorized to access this job.
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
VendorRouter.get('/getjobbyvendor/:jobId', validateJWT, vendorPermission, vendorController.getJobByVendor);

/**
 * @swagger
 * /updatejobbyvendor:
 *   put:
 *     summary: Update an existing job posting by vendor
 *     description: Allows an authenticated vendor to update their existing job posting. The vendor ID is automatically extracted from the JWT token. Vendor can only update jobs they created. Job ID is required in the request body along with fields to update.
 *     tags:
 *       - Vendor
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
 *                     vendorId:
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
 *         description: Job not found or vendor not authorized to update this job.
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
VendorRouter.put('/updatejobbyvendor', validateJWT, vendorPermission, validateRequest(updateJobSchema), vendorController.updateJobByVendor);

/**
 * @swagger
 * /deletejob/{jobId}:
 *   delete:
 *     summary: Delete a job by ID
 *     tags:
 *       - Vendor 
 *     security:
 *       - BearerAuth: []
 *     description: Delete job created by a vendor.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Job ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job deleted successfully
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
 *                   example: "Job deleted successfully !"
 *       400:
 *         description: Invalid job ID
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
VendorRouter.delete('/deletejob/:jobId', validateJWT, vendorPermission, vendorController.deleteJobByVendor)

export default VendorRouter;
