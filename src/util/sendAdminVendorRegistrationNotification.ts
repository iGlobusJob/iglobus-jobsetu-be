import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const emailConfiguration: any = {
    service: process.env.EMAIL_CONFIG_SERVICE,
    host: process.env.EMAIL_CONFIG_HOST,
    port: Number(process.env.EMAIL_CONFIG_PORT),
    secure: Boolean(process.env.EMAIL_CONFIG_SECURE),
    auth: {
        user: process.env.EMAIL_CONFIG_AUTH_USER,
        pass: process.env.EMAIL_CONFIG_AUTH_PASS,
    }
}

const sendAdminNotificationEmail = async (organizationName: string, vendorEmail: string, vendorId: string) => {
    try {
        const transporter = nodemailer.createTransport(emailConfiguration);
        const mailBody = `     
<html>
  <body style="font-family: serif; background-color: #f4f4f9; padding: 20px;">
    <div style="max-width: 750px; height:auto; margin: 0 auto; border: 1px solid #f7f1f4 ; border-radius: 5px;">
      <!-- Header Section -->
      <div style="background-color:rgb(121, 181, 245); color: #fff; text-align: center; padding: 10px; border-top-left-radius: 5px; border-top-right-radius: 5px;">
        <h2 style="margin: 0; font-size: 18px;">New Vendor Registration - Action Required</h2>
      </div>

      <!-- Body Section -->
      <div style="background-color:rgb(220, 235, 248); padding: 20px; color:#4f4a4c "><br><br>
        <p style="margin: 0 0 15px; font-size: 14px; color: #333;">
          Dear Admin,
        </p>

        <p style="margin: 0 0 15px; font-size: 14px; color: #333;">
          A new vendor has registered on <b>Job Setu</b> and is awaiting your approval.
        </p>

        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0; font-size: 14px; color: #333;">
            <b>Organization Name:</b> ${organizationName}
          </p>
          <p style="margin: 5px 0; font-size: 14px; color: #333;">
            <b>Email:</b> ${vendorEmail}
          </p>
          <p style="margin: 5px 0; font-size: 14px; color: #333;">
            <b>Vendor ID:</b> ${vendorId}
          </p>
        </div>

        <p style="margin: 0 0 15px; font-size: 14px; color: #333;">
          Please review the vendor details and approve the account to allow them to access the platform.
        </p>

        <p style="margin: 20px 0 5px; font-size: 14px; color: #333;">Regards,</p>
        <p style="font-size: 14px; font-weight: bold; color: #333;">Team iGLOBUS - Job Setu System</p>
      </div>
    </div>
  </body>
</html>`;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.ADMIN_EMAIL_ABOUT_CUSTOMER,
            subject: `New Vendor Registration: ${organizationName} - Approval Pending`,
            html: mailBody,
        };

        const result = await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending admin notification email:', error);
                return error;
            }

            console.log('Admin notification email sent successfully:', info.response);
            return info.response;
        });
        return result;
    } catch (error) {
        console.log('Error in sending admin notification email:', error);
        return error;
    }
}

export default { sendAdminNotificationEmail };
