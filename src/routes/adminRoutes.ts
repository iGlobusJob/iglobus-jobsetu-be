import express, { Router } from 'express';
import adminController from '../controllers/adminController';
import validateRequest from '../middlewares/validateRequest';
import updateVendorByAdminSchema from '../middlewares/schemas/updateVendorByAdminSchema';
import clientIdSchema from '../middlewares/schemas/clientIdSchema';
import validateJWT from '../middlewares/validateJWT';

const AdminRouter: Router = express.Router();

/**
 * @swagger
 * /admin:
 *   post:
 *     tags:
 *       - Admin
 *     summary: admin login
 *     description: Enter your admin credentials to login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "admin@jobsetu.com"
 *               password:
 *                 type: string
 *                 example: "Admin@12345"
 *     responses:
 *       200:
 *         description: Admin login successfully
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
 *                   example: "Logged in Successfully !"
 *                 username:
 *                   type: string
 *                   example: "admin@jobsetu.com"
 *                 role:
 *                   type: string
 *                   example: "superadmin"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       500:
 *         description: Failed to admin login
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
 *                   example: "Failed to admin login"
 */
AdminRouter.post('/admin', adminController.adminLogin);

/**
 * @swagger
 * /createadmin:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create a new admin
 *     description: Creates a new admin account. Requires a valid JWT token. 
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: newadmin
 *               password:
 *                 type: string
 *                 example: Admin@123
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: Admin created successfully
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
 *                   example: Admin created successfully
 *                 admin:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: newadmin
 *                     role:
 *                       type: string
 *                       example: admin
 *       400:
 *         description: Admin already exists
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Internal server error
 */
AdminRouter.post('/createadmin', validateJWT, adminController.createAdmin);

/**
 * @swagger
 * /getallclients:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     summary: Get all clients
 *     description: Retrieve a list of all clients. This endpoint is restricted to admin users only.
 *     responses:
 *       200:
 *         description: List of clients retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 vendors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "670fc1b9c9c47e3456a12345"
 *                       primaryContact:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                             example: "John"
 *                           lastName:
 *                             type: string
 *                             example: "Doe"
 *                       organizationName:
 *                         type: string
 *                         example: "Tech Solutions Pvt Ltd"
 *                       email:
 *                         type: string
 *                         example: "vendor@example.com"
 *                       secondaryContact:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                             example: "Jane"
 *                           lastName:
 *                             type: string
 *                             example: "Doe"
 *                       status:
 *                         type: string
 *                         enum:
 *                           - registered
 *                           - active
 *                           - inactive
 *                         example: active
 *                       emailStatus:
 *                         type: string
 *                         enum:
 *                           - verified
 *                           - notverified
 *                         example: "verified"
 *                       mobile:
 *                         type: string
 *                         example: "+91 9876543210"
 *                       mobileStatus:
 *                         type: string
 *                         enum:
 *                           - verified
 *                           - notverified
 *                         example: "notverified"
 *                       location:
 *                         type: string
 *                         example: "Mumbai, India"
 *                       gstin:
 *                         type: string
 *                         example: "29ABCDE1234F1Z5"
 *                       panCard:
 *                         type: string
 *                         example: "ABCDE1234F"
 *                       category:
 *                         type: string
 *                         enum: [IT, Non-IT]
 *                         example: "IT"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-01T10:20:30Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-05T12:45:10Z"
 *       500:
 *         description: Internal server error occurred while fetching clients.
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
 *                   example: "Failed to fetch client details."
 */
AdminRouter.get('/getallclients', validateJWT, adminController.getAllClients);

/**
 * @swagger
 * /getclientdetailsbyadmin/{clientId}:
 *   get:
 *     summary: Get client details by ID (Admin only)
 *     description: Allows admin to retrieve complete details of a specific client by their ID. Requires JWT authentication. The clientId must be a valid 24-character MongoDB ObjectId.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the client (24 character hexadecimal string)
 *         example: 507f1f77bcf86cd799439011
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
 *                   example: "Vendor details fetched successfully !"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     email:
 *                       type: string
 *                       example: "john.doe@xyztechnologies.com"
 *                     organizationName:
 *                       type: string
 *                       example: "XYZ Technologies Pvt Ltd"
 *                     status:
 *                       type: string
 *                       enum: [registered, active, inactive]
 *                       example: "active"
 *                     emailStatus:
 *                       type: string
 *                       enum: [verified, notverified]
 *                       example: "verified"
 *                     mobile:
 *                       type: string
 *                       example: "9876543210"
 *                     mobileStatus:
 *                       type: string
 *                       enum: [verified, notverified]
 *                       example: "notverified"
 *                     location:
 *                       type: string
 *                       example: "Hyderabad"
 *                     gstin:
 *                       type: string
 *                       example: "22AAAAA0000A1Z5"
 *                     panCard:
 *                       type: string
 *                       example: "ABCDE1234F"
 *                     category:
 *                       type: string
 *                       enum: [IT, Non-IT]
 *                       example: "IT"
 *                     primaryContact:
 *                       type: object
 *                       properties:
 *                         firstName:
 *                           type: string
 *                           example: "John"
 *                         lastName:
 *                           type: string
 *                           example: "Doe"
 *                     secondaryContact:
 *                       type: object
 *                       properties:
 *                         firstName:
 *                           type: string
 *                           example: "Jane"
 *                         lastName:
 *                           type: string
 *                           example: "Smith"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-13T10:30:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-13T10:30:00.000Z"
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
 *       400:
 *         description: Bad Request - Invalid clientId format
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
 *                 missingFields:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "clientId"
 *                       message:
 *                         type: string
 *                         example: "Invalid client ID format. Must be a valid MongoDB ObjectId"
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
 *                   example: "Vendor not found !"
 *       500:
 *         description: Internal server error occurred while fetching vendor details
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
AdminRouter.get('/getclientdetailsbyadmin/:clientId', validateJWT, validateRequest(clientIdSchema, 'params'), adminController.getClientDetailsByAdmin);

/**
 * @swagger
 * /updatevendorbyadmin:
 *   put:
 *     summary: Update vendor details by admin
 *     description: Allows admin to update any vendor details except email. Requires JWT authentication. Password will be hashed if updated.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vendorId
 *             properties:
 *               vendorId:
 *                 type: string
 *                 pattern: '^[0-9a-fA-F]{24}$'
 *                 description: MongoDB ObjectId of the vendor (24 character hexadecimal string)
 *                 example: 507f1f77bcf86cd799439011
 *               primaryContact:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     description: First name of the primary contact (min 2 characters)
 *                     example: John
 *                   lastName:
 *                     type: string
 *                     description: Last name of the primary contact (min 2 characters)
 *                     example: Doe
 *               organizationName:
 *                 type: string
 *                 description: Name of the vendor organization (2-100 characters)
 *                 example: XYZ Technologies Pvt Ltd
 *               password:
 *                 type: string
 *                 description: New password for vendor account (min 8 chars, must contain uppercase, lowercase, number and special character)
 *                 example: NewSecurePass@123
 *               secondaryContact:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     description: First name of the secondary contact
 *                     example: Jane
 *                   lastName:
 *                     type: string
 *                     description: Last name of the secondary contact
 *                     example: Smith
 *               status:
 *                 type: string
 *                 enum: [registered, active, inactive]
 *                 description: Registration status of the vendor
 *                 example: active
 *               emailStatus:
 *                 type: string
 *                 enum: [verified, notverified]
 *                 description: Email verification status
 *                 example: verified
 *               mobile:
 *                 type: string
 *                 description: Mobile number of the vendor (must be 10 digits)
 *                 example: "9876543210"
 *               mobileStatus:
 *                 type: string
 *                 enum: [verified, notverified]
 *                 description: Mobile verification status
 *                 example: verified
 *               location:
 *                 type: string
 *                 description: Location of the vendor
 *                 example: Mumbai
 *               gstin:
 *                 type: string
 *                 description: GST Identification Number (15 characters, uppercase letters and numbers only)
 *                 example: 22AAAAA0000A1Z5
 *               panCard:
 *                 type: string
 *                 description: PAN Card number (10 characters, format - AAAAA9999A)
 *                 example: ABCDE1234F
 *               category:
 *                 type: string
 *                 enum: [IT, Non-IT]
 *                 description: Vendor category
 *                 example: IT
 *     responses:
 *       200:
 *         description: Vendor updated successfully
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
 *                   example: Vendor updated successfully !
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     organizationName:
 *                       type: string
 *                     status:
 *                       type: string
 *                     emailStatus:
 *                       type: string
 *                     mobile:
 *                       type: string
 *                     mobileStatus:
 *                       type: string
 *                     location:
 *                       type: string
 *                     gstin:
 *                       type: string
 *                     panCard:
 *                       type: string
 *                     category:
 *                       type: string
 *                       enum: [IT, Non-IT]
 *                       example: IT
 *                     primaryContact:
 *                       type: object
 *                     secondaryContact:
 *                       type: object
 *       400:
 *         description: Validation error - Invalid data provided
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
 *         description: Unauthorized - No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No token provided !
 *       403:
 *         description: Forbidden - Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid token !
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
 *                   example: Vendor not found !
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
 *                   example: An error occurred while updating vendor details. Please try again later !
 */
AdminRouter.put('/updatevendorbyadmin', validateJWT, validateRequest(updateVendorByAdminSchema), adminController.updateVendorByAdmin);

/**
 * @swagger
 * /getcandidatedetailsbyadmin/{candidateid}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get candidate details by admin
 *     description: Allows admin to retrieve complete details of a specific candidate by their ID. Requires JWT authentication.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateid
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         description: MongoDB ObjectId of the candidate (24 character hexadecimal string)
 *     responses:
 *       200:
 *         description: Candidate details fetched successfully.
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
 *                   example: Candidate details fetched successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64ab0e86c2a4f92fa40b7c1a"
 *                     email:
 *                       type: string
 *                       example: "candidate@example.com"
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
 *                       example: "123 Main Street"
 *                     dateOfBirth:
 *                       type: string
 *                       example: "1995-02-10"
 *                     gender:
 *                       type: string
 *                       example: "Male"
 *                     createdAt:
 *                       type: string
 *                       example: "2024-01-10T12:45:32.120Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2024-01-10T12:45:32.120Z"
 *
 *       404:
 *         description: Candidate not found.
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
 *                   example: Candidate not found.
 *
 *       500:
 *         description: Internal server error.
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
 *                   example: Failed to fetch candidate details.
 */
AdminRouter.get('/getcandidatedetailsbyadmin/:candidateid', validateJWT, adminController.getCandidateDetailsByAdmin);

/**
 * @swagger
 * /getalljobsbyadmin:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all jobs (Admin only)
 *     description: Fetches a list of all jobs from the database.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 jobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "64f1b5e4a1234567890abcd1"
 *                       vendorId:
 *                         type: string
 *                         example: "vendor123"
 *                       jobTitle:
 *                         type: string
 *                         example: "Software Engineer"
 *                       jobDescription:
 *                         type: string
 *                         example: "Responsible for backend API development."
 *                       postStart:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-01T09:00:00Z"
 *                       noOfPositions:
 *                         type: integer
 *                         example: 3
 *                       minimumSalary:
 *                         type: number
 *                         example: 40000
 *                       maximumSalary:
 *                         type: number
 *                         example: 70000
 *                       jobType:
 *                         type: string
 *                         example: "Full-Time"
 *                       jobLocation:
 *                         type: string
 *                         example: "Remote"
 *                       minimumExperience:
 *                         type: integer
 *                         example: 2
 *                       maximumExperience:
 *                         type: integer
 *                         example: 5
 *                       status:
 *                         type: string
 *                         example: "Active"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-10T14:22:10Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-12T15:40:20Z"
 *       401:
 *         description: Unauthorized - JWT token missing or invalid
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
 *                   example: "Unauthorized access"
 *       500:
 *         description: Server error while fetching jobs
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
 *                   example: "Failed to fetch jobs details"
 */
AdminRouter.get('/getalljobsbyadmin', validateJWT, adminController.getAllJobsByAdmin);

export default AdminRouter;
