# JobSetu Backend API

A comprehensive Job Management and Recruitment Platform backend built with Node.js, Express, TypeScript, and MongoDB. JobSetu facilitates job postings, candidate applications, and streamlined communication between clients, recruiters, candidates, and administrators.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.0-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.7.0-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Available Scripts](#-available-scripts)
- [Authentication & Authorization](#-authentication--authorization)
- [File Uploads](#-file-uploads)
- [Email Notifications](#-email-notifications)
- [Development Guidelines](#-development-guidelines)

## 🚀 Features

### Multi-Role Management
- **Admin Panel**: Manage clients, recruiters, candidates, and jobs with full CRUD operations
- **Client Portal**: Register organizations, post jobs, manage applications
- **Candidate Portal**: Profile management, job search, application tracking
- **Recruiter Dashboard**: Manage candidates and job postings

### Core Functionality
- ✅ User authentication with JWT tokens
- ✅ Role-based access control (Admin, Client, Candidate, Recruiter)
- ✅ OTP-based email verification
- ✅ Password encryption with bcrypt
- ✅ File uploads (Resume, Profile Pictures, Company Logos) to AWS S3
- ✅ Job posting and management
- ✅ Candidate application tracking
- ✅ Email notifications for various events
- ✅ Contact form with automated responses
- ✅ Comprehensive API documentation with Swagger
- ✅ Input validation with Joi schemas
- ✅ RESTful API architecture

## 🛠 Tech Stack

### Backend Framework
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe JavaScript

### Database
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcrypt** - Password hashing
- **express-session** - Session management
- **crypto-js** - Cryptographic functions

### File Storage
- **AWS S3** - Cloud storage for files
- **Multer** - Middleware for handling multipart/form-data

### Email Service
- **Nodemailer** - Email sending functionality
- **Gmail SMTP** - Email service provider

### Validation & Documentation
- **Joi** - Schema validation
- **Swagger UI Express** - API documentation interface
- **Swagger JSDoc** - Generate Swagger docs from JSDoc comments

### Development Tools
- **Nodemon** - Auto-restart during development
- **Morgan** - HTTP request logger
- **ESLint** - Code linting
- **Jest** - Testing framework
- **ts-node** - TypeScript execution for Node.js

## 📁 Project Structure

```
iglobus-jobsetu-be/
├── src/
│   ├── config/                      # Configuration files
│   │   ├── awsS3Config.ts          # AWS S3 configuration
│   │   ├── databaseConfig.ts       # MongoDB connection
│   │   ├── initializeCollections.ts # Database initialization
│   │   └── swagger.ts              # Swagger documentation config
│   │
│   ├── constants/                   # Application constants
│   │   ├── adminMessages.ts        # Admin-related messages
│   │   ├── candidateMessages.ts    # Candidate-related messages
│   │   ├── clientMessages.ts       # Client-related messages
│   │   ├── commonMessages.ts       # Common messages
│   │   └── recruiterMessages.ts    # Recruiter-related messages
│   │
│   ├── controllers/                 # Request handlers
│   │   ├── adminController.ts      # Admin operations
│   │   ├── candidateController.ts  # Candidate operations
│   │   ├── clientController.ts     # Client operations
│   │   ├── commonController.ts     # Shared operations
│   │   └── recruiterController.ts  # Recruiter operations
│   │
│   ├── interfaces/                  # TypeScript interfaces
│   │   ├── admin.ts
│   │   ├── candidate.ts
│   │   ├── candidateJob.ts
│   │   ├── client.ts
│   │   ├── common.ts
│   │   ├── jobs.ts
│   │   └── recruiter.ts
│   │
│   ├── middlewares/                 # Express middlewares
│   │   ├── schemas/                # Joi validation schemas
│   │   │   ├── candidateJoinSchema.ts
│   │   │   ├── clientIdSchema.ts
│   │   │   ├── clientLoginSchema.ts
│   │   │   ├── clientSchema.ts
│   │   │   ├── createJobSchema.ts
│   │   │   ├── jobIdSchema.ts
│   │   │   ├── recruiterSchema.ts
│   │   │   ├── updateCandidateProfileSchema.ts
│   │   │   ├── updateClientByAdminSchema.ts
│   │   │   ├── updateClientProfileSchema.ts
│   │   │   ├── updateJobSchema.ts
│   │   │   ├── userSchema.ts
│   │   │   └── validateOTPSchema.ts
│   │   ├── adminPermission.ts      # Admin authorization
│   │   ├── candidatePermission.ts  # Candidate authorization
│   │   ├── clientPermission.ts     # Client authorization
│   │   ├── parseFormData.ts        # Form data parser
│   │   ├── uploadFieldsMiddleware.ts
│   │   ├── uploadLogoMiddleware.ts
│   │   ├── uploadMiddleware.ts
│   │   ├── validateJWT.ts          # JWT validation
│   │   └── validateRequest.ts      # Request validation
│   │
│   ├── model/                       # Mongoose models
│   │   ├── adminModel.ts           # Admin schema
│   │   ├── candidateJobModel.ts    # Candidate-Job mapping
│   │   ├── candidateModel.ts       # Candidate schema
│   │   ├── clientModel.ts          # Client schema
│   │   ├── jobsModel.ts            # Job schema
│   │   └── recruiterModel.ts       # Recruiter schema
│   │
│   ├── routes/                      # API routes
│   │   ├── adminRoutes.ts          # Admin endpoints
│   │   ├── candidateRoutes.ts      # Candidate endpoints
│   │   ├── clientRoutes.ts         # Client endpoints
│   │   ├── commonRoutes.ts         # Common endpoints
│   │   └── recruiterRoutes.ts      # Recruiter endpoints
│   │
│   ├── services/                    # Business logic
│   │   ├── adminService.ts
│   │   ├── candidateServices.ts
│   │   ├── clientServices.ts
│   │   ├── commonServices.ts
│   │   └── recruiterServices.ts
│   │
│   ├── types/                       # Type definitions
│   │   ├── jobsStatus.ts
│   │   ├── registrationStatus.ts
│   │   └── verificationStatus.ts
│   │
│   ├── util/                        # Utility functions
│   │   ├── emailConfig.ts          # Shared email configuration
│   │   ├── generatePresignedUrl.ts
│   │   ├── hashPassword.ts
│   │   ├── jwtUtil.ts
│   │   ├── manageProfileImages.ts
│   │   ├── s3Client.ts
│   │   ├── sendAdminClientRegistrationNotification.ts
│   │   ├── sendcandidateRegistrationOTPEmail.ts
│   │   ├── sendClientRegistrationEmail.ts
│   │   ├── sendContactUsEmail.ts
│   │   ├── sendForgetPasswordOTPEmail.ts
│   │   ├── sendJobAppliedMail.ts
│   │   ├── uploadLogoToS3.ts
│   │   ├── uploadProfilePictureToS3.ts
│   │   └── uploadResumeToS3.ts
│   │
│   └── index.ts                     # Application entry point
│
├── .env                             # Environment variables
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── eslint.config.mjs                # ESLint configuration
└── README.md                        # This file
```

## 🏁 Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- MongoDB (v8.x or higher)
- npm or yarn
- AWS S3 account (for file storage)
- Gmail account (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd iglobus-jobsetu-be
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see [Environment Variables](#-environment-variables))

5. **Build the project**
   ```bash
   npm run build
   ```

6. **Run the application**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

7. **Access the API**
   - Server: `http://localhost:3000`
   - Swagger Documentation: `http://localhost:3000/api-docs`

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000

# Database Configuration
DB_CONNECTION_STRING=mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=Cluster0
DB_NAME=<database-name>

# JWT Secret
SECRET_KEY=<your-secret-key>

# Email Configuration (Gmail SMTP)
EMAIL_CONFIG_SERVICE=Gmail
EMAIL_CONFIG_HOST=smtp.gmail.com
EMAIL_CONFIG_PORT=465
EMAIL_CONFIG_SECURE=true
EMAIL_CONFIG_AUTH_USER=<your-email@gmail.com>
EMAIL_CONFIG_AUTH_PASS=<app-specific-password>

# Email Addresses
EMAIL_FROM=<sender-email@gmail.com>
ADMIN_EMAIL_ABOUT_CUSTOMER=<admin-email@gmail.com>

# AWS S3 Configuration
AWS_REGION=<aws-region>
AWS_ACCESS_KEY_ID=<your-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-secret-access-key>
```

### Important Notes:
- For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password
- Never commit the `.env` file to version control
- Keep your AWS credentials secure

## 📚 API Documentation

### Accessing Swagger UI

Once the server is running, access the interactive API documentation at:
```
http://localhost:3000/api-docs
```

### Main API Endpoints

#### Common Routes
- `GET /` - Health check endpoint
- `GET /getallcandidates` - Get all candidates (requires JWT)
- `GET /getcandidatedetailsbyid/:candidateID` - Get candidate by ID (requires JWT)
- `GET /getjobdetailsbyid/:jobId` - Get job details by ID
- `GET /getalljobs` - Get all jobs
- `POST /contactus` - Submit contact form

#### Admin Routes
- `POST /admin` - Admin login
- `POST /createadmin` - Create new admin (requires JWT + admin permission)
- `GET /getallclientsforadmin` - Get all clients
- `PUT /updateclientdetailsbyadmin` - Update client details
- `DELETE /deleteclientbyadmin/:clientId` - Delete client
- `POST /createrecruiter` - Create recruiter

#### Client Routes
- `POST /registerclient` - Register new client (with logo upload)
- `POST /loginclient` - Client login
- `GET /getclientprofile` - Get client profile (requires JWT)
- `PUT /updateclientprofile` - Update client profile (requires JWT)
- `POST /createjobbyclient` - Create job posting (requires JWT)
- `GET /getalljobsbyclient` - Get all jobs for client (requires JWT)
- `GET /getjobbyclient/:jobId` - Get job by ID for client (requires JWT)
- `PUT /updatejobbyclient` - Update job (requires JWT)

#### Candidate Routes
- `POST /join` - Candidate registration/login (sends OTP)
- `POST /validateOTP` - Validate OTP
- `GET /getcandidateprofile` - Get candidate profile (requires JWT)
- `PUT /updatecandidateprofile` - Update candidate profile (requires JWT)
- `POST /applyjob/:jobId` - Apply for a job (requires JWT)
- `GET /getallcandidateappliedjobs` - Get all applied jobs (requires JWT)

#### Recruiter Routes
- `POST /createrecruiter` - Create recruiter account
- `GET /getallrecruiters` - Get all recruiters (requires JWT)
- `GET /getrecruiterbyid/:recruiterId` - Get recruiter by ID (requires JWT)

## 🗄 Database Schema

### Collections

#### Candidates
```typescript
{
  email: String (unique, required)
  firstName: String
  lastName: String
  mobileNumber: String
  address: String
  dateOfBirth: Date
  gender: String
  category: 'IT' | 'Non-IT'
  profile: String
  profileUrl: String
  profilePicture: String (S3 key)
  profilePictureUrl: String
  otp: String (5 digits)
  otpexpiredAt: Date
  createdAt: Date
  updatedAt: Date
}
```

#### Clients
```typescript
{
  primaryContact: {
    firstName: String (required)
    lastName: String (required)
  }
  organizationName: String (required)
  email: String (unique, required)
  password: String (hashed, required)
  secondaryContact: {
    firstName: String
    lastName: String
  }
  status: 'registered' | 'active' | 'inactive'
  emailStatus: 'verified' | 'notverified'
  mobile: String
  mobileStatus: 'verified' | 'notverified'
  location: String
  gstin: String (required)
  panCard: String (required)
  category: 'IT' | 'Non-IT' (required)
  logo: String (S3 key)
  createdAt: Date
  updatedAt: Date
}
```

#### Jobs
```typescript
{
  clientId: ObjectId (ref: 'client', required)
  organizationName: String (required)
  logo: String (S3 key)
  jobTitle: String (required)
  jobDescription: String
  postStart: Date
  postEnd: Date
  noOfPositions: Number
  minimumSalary: Number
  maximumSalary: Number
  jobType: 'full-time' | 'part-time' | 'internship' | 'freelance' | 'contract'
  jobLocation: String
  minimumExperience: Number
  maximumExperience: Number
  status: 'active' | 'closed' | 'drafted'
  createdAt: Date
  updatedAt: Date
}
```

#### Recruiters
```typescript
{
  firstName: String (required)
  lastName: String (required)
  email: String (unique, required)
  password: String (hashed, required)
  createdAt: Date
  updatedAt: Date
}
```

#### Admins
```typescript
{
  username: String (unique, required)
  password: String (hashed, required)
  role: 'superadmin' | 'admin'
  createdAt: Date
  updatedAt: Date
}
```

## 📜 Available Scripts

```bash
# Development
npm run dev              # Run in development mode with hot reload

# Production
npm run build            # Compile TypeScript to JavaScript
npm start                # Run compiled code from dist/

# Testing
npm test                 # Run Jest tests
npm run coverage         # Generate test coverage report

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors automatically

# Database Scripts
npm run executeInsertScript  # Run database insert scripts
npm run executeUpdateScript  # Run database update scripts
```

## 🔒 Authentication & Authorization

### JWT Token Flow

1. **User Login**: User provides credentials
2. **Token Generation**: Server validates credentials and generates JWT token
3. **Token Response**: Token returned to client
4. **Subsequent Requests**: Client includes token in Authorization header
   ```
   Authorization: Bearer <token>
   ```
5. **Token Validation**: Server validates token on protected routes

### Role-Based Access Control

- **Admin**: Full system access, manages all entities
- **Client**: Manage own profile, create/manage jobs, view candidates
- **Candidate**: Manage own profile, apply to jobs, view applications
- **Recruiter**: View candidates and jobs

### Middleware Protection

Protected routes use middleware in this order:
1. `validateJWT` - Verifies JWT token
2. `[role]Permission` - Checks user role authorization
3. Controller logic executes

## 📤 File Uploads

### Supported File Types

- **Resumes**: PDF, DOC, DOCX (max 5MB)
- **Profile Pictures**: JPG, JPEG, PNG (max 2MB)
- **Company Logos**: JPG, JPEG, PNG (max 2MB)

### Upload Process

1. Files uploaded via multipart/form-data
2. Multer middleware processes upload
3. Files stored in AWS S3 bucket
4. S3 key stored in database
5. Pre-signed URLs generated for secure access

### AWS S3 Configuration

Ensure your S3 bucket has proper CORS configuration and access policies.

## 📧 Email Notifications

### Automated Emails

The system sends automated emails for:

1. **OTP Verification** - Candidate registration/login
2. **Client Registration** - Welcome email to client
3. **Admin Notification** - New client registration alert
4. **Job Application** - Confirmation email to candidate
5. **Forget Password** - OTP for password reset
6. **Contact Form** - Confirmation to user + notification to admin

### Email Configuration

All email utilities use a shared configuration from `src/util/emailConfig.ts`:
- Centralized SMTP settings
- Reusable email transporter
- Easy maintenance and updates

## 🔧 Development Guidelines

### Code Structure

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and data processing
- **Models**: Database schemas and data access
- **Middlewares**: Request processing, validation, authorization
- **Utils**: Reusable helper functions

### Best Practices

1. **Type Safety**: Use TypeScript interfaces for all data structures
2. **Validation**: Validate all inputs using Joi schemas
3. **Error Handling**: Use try-catch blocks and return appropriate status codes
4. **Security**: Never expose sensitive data, hash passwords, sanitize inputs
5. **Logging**: Use console.error for errors, console.warn for warnings
6. **Documentation**: Document all APIs using Swagger/JSDoc comments

### Adding New Features

1. Define interface in `src/interfaces/`
2. Create Mongoose model in `src/model/`
3. Create Joi schema in `src/middlewares/schemas/`
4. Implement business logic in `src/services/`
5. Create controller in `src/controllers/`
6. Define routes with Swagger docs in `src/routes/`
7. Add constants/messages in `src/constants/`
8. Test thoroughly

### Environment-Specific Behavior

- **Development**: Detailed logging, CORS enabled
- **Production**: Minimal logging, proper error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Support

For support and queries, contact via the Contact Us form or reach out to the development team.

---

**Built with ❤️ by SRYTAL Systems India Private Limited Development Team**