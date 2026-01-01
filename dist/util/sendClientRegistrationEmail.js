"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const emailConfiguration = {
    service: process.env.EMAIL_CONFIG_SERVICE,
    host: process.env.EMAIL_CONFIG_HOST,
    port: Number(process.env.EMAIL_CONFIG_PORT),
    secure: Boolean(process.env.EMAIL_CONFIG_SECURE),
    auth: {
        user: process.env.EMAIL_CONFIG_AUTH_USER,
        pass: process.env.EMAIL_CONFIG_AUTH_PASS,
    }
};
const sendClientRegistrationEmail = async (email, organizationName) => {
    try {
        console.warn('Reached sendClientRegistrationEmail !!');
        const transporter = nodemailer_1.default.createTransport(emailConfiguration);
        console.warn('Transporter created !!');
        const mailBody = `     
<html>
  <body style="font-family: serif; background-color: #f4f4f9; padding: 20px;">
    <div style="max-width: 750px; height:auto; margin: 0 auto; border: 1px solid #f7f1f4 ; border-radius: 5px;">
      <!-- Header Section -->
      <div style="background-color:rgb(121, 181, 245); color: #fff; text-align: center; padding: 10px; border-top-left-radius: 5px; border-top-right-radius: 5px;">
        <h2 style="margin: 0; font-size: 18px;">Welcome to JobSetu</h2>
      </div>

      <!-- Body Section -->
      <div style="background-color:rgb(220, 235, 248); padding: 20px; color:#4f4a4c "><br><br>
        <p style="margin: 0 0 15px; font-size: 14px; color: #333;">
          Dear <b>${organizationName}</b>,
        </p>

        <p style="margin: 0 0 15px; font-size: 14px; color: #333;">
          Thank you for registering with <b>JobSetu</b>! Your account has been successfully created.
        </p>

        <p style="margin: 0 0 15px; font-size: 14px; color: #333;">
          Your registration is currently under review by our admin team. You will be notified once your account is approved and activated.
        </p>

        <p style="margin: 0 0 15px; font-size: 14px; color: #333;">
          Please reach out to 
          <a href="mailto:iglobusjobsetu@gmail.com" style="color: #007bff; text-decoration: none;">
            iglobusjobsetu@gmail.com
          </a>, if you have any questions or need assistance.
        </p><br>

        <p style="margin: 20px 0 5px; font-size: 14px; color: #333;">Regards,</p>
        <p style="font-size: 14px; font-weight: bold; color: #333;">Team iGLOBUS</p>
      </div>
    </div>
  </body>
</html>`;
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Welcome to JobSetu - Account Under Review',
            html: mailBody,
        };
        console.warn(`Mail options prepared: ${JSON.stringify(mailOptions)}`);
        const result = await transporter.sendMail(mailOptions);
        console.warn(`Client registration email sent successfully: ${result.response}`);
        return result;
    }
    catch (error) {
        console.error('Error in sending client registration email:', error);
        throw error;
    }
};
exports.default = { sendClientRegistrationEmail };
