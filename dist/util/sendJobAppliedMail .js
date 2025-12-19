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
const candidateJobApplied = async (email, jobTitle) => {
    try {
        const transporter = nodemailer_1.default.createTransport(emailConfiguration);
        const mailBody = `     
<html>
  <body style="font-family: serif; background-color: #f4f4f9; padding: 20px;">
    <div style="max-width: 750px; height:auto; margin: 0 auto; border: 1px solid #f7f1f4; border-radius: 5px;">
      
      <!-- Header Section -->
      <div style="background-color:rgb(121, 181, 245); color: #fff; text-align: center; padding: 10px; border-top-left-radius: 5px; border-top-right-radius: 5px;">
        <h2 style="margin: 0; font-size: 18px;">Job applied successfully</h2>
      </div>

      <!-- Body Section -->
      <div style="background-color:rgb(220, 235, 248); padding: 20px; color:#4f4a4c;">
        <br><br>

        <p style="margin: 0 0 15px; font-size: 14px; color: #333;">
          We are pleased to inform you that you have successfully applied for the following position:
        </p>

        <p style="margin: 0 0 15px; font-size: 16px; color: #333;">
          <b>Position:</b> 
          <span style="font-size: 16px; font-weight: bold; color: #007bff;">
            ${jobTitle}
          </span>
        </p>

        <p style="margin: 0 0 15px; font-size: 14px; color: #333;">
          Our recruitment team will review your application and contact you if your profile matches the job requirements.
        </p>

        <p style="margin: 0 0 15px; font-size: 14px; color: #333;">
          You can track the status of your application by logging into your Job Setu account.
        </p>

        <p style="margin: 0 0 15px; font-size: 14px; color: #333;">
          If you have any questions or face issues, please reach out to
          <a href="mailto:iglobusjobsetu@gmail.com" style="color: #007bff; text-decoration: none;">
            iglobusjobsetu@gmail.com
          </a>.
        </p>

        <br>

        <p style="margin: 20px 0 5px; font-size: 14px; color: #333;">Regards,</p>
        <p style="font-size: 14px; font-weight: bold; color: #333;">Team iGLOBUS</p>
      </div>
    </div>
  </body>
</html>
`;
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Job Application Submitted Successfully',
            html: mailBody,
        };
        const result = await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending send job applied email:', error);
                return error;
            }
            console.log('send job applied email sent successfully:', info.response);
            return info.response;
        });
        return result;
    }
    catch (error) {
        console.log('Failed to send job applied email:', error);
        return error;
    }
};
exports.default = candidateJobApplied;
