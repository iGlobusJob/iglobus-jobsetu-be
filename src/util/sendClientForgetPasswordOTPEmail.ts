import createEmailTransporter from './emailConfig';

const sendClientForgetPasswordOTPEmail = async (firstName: string, lastName: string, email: string, otp: string) => {
    try {
        const transporter = createEmailTransporter();
        const mailBody = `     
<html>
  <body style="font-family: serif; background-color: #f4f4f9; padding: 20px;">
    <div style="max-width: 750px; height:auto; margin: 0 auto; border: 1px solid #f7f1f4 ; border-radius: 5px;">
      <!-- Header Section -->
      <div style="background-color:rgb(121, 181, 245); color: #fff; text-align: center; padding: 10px; border-top-left-radius: 5px; border-top-right-radius: 5px;">
        <h2 style="margin: 0; font-size: 18px;">Hello <b>${firstName} ${lastName}</b></h2>
      </div>

      <!-- Body Section -->
      <div style="background-color:rgb(220, 235, 248); padding: 20px; color:#4f4a4c "><br><br>
        <p style="margin: 0 0 15px; font-size: 14px; color: #333;">
          We received a request to reset your password. Please use the OTP below to proceed with resetting your password.
        </p>

        <p style="margin: 0 0 15px; font-size: 16px; color: #333;">
          <b>Your OTP is:</b> <span style="font-size: 24px; color: #007bff; font-weight: bold;">${otp}</span>
        </p>

        <p style="margin: 0 0 15px; font-size: 14px; color: #d9534f; font-weight: bold;">
          <u>Note:</u> This OTP is valid for 10 minutes only. Please do not share this OTP with anyone.
        </p>

        <p style="margin: 0 0 15px; font-size: 14px; color: #333;">
          If you did not request a password reset, please ignore this email or contact support immediately.
        </p>

        <p style="margin: 0 0 15px; font-size: 14px; color: #333;">
          Please reach out to 
          <a href="mailto:iglobusjobsetu@gmail.com" style="color: #007bff; text-decoration: none;">
            iglobusjobsetu@gmail.com
          </a>, if you are facing any issues.
        </p><br>

        <p style="margin: 20px 0 5px; font-size: 14px; color: #333;">Regards,</p>
        <p style="font-size: 14px; font-weight: bold; color: #333;">JOBSETU Team.</p>
      </div>
    </div>
  </body>
</html>`;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Password Reset OTP - JobSetu',
            html: mailBody,
        };

        await transporter.sendMail(mailOptions);
        console.warn('Forget password OTP email sent successfully to:', email);
    } catch (error) {
        console.error('Error sending forget password OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};

export default sendClientForgetPasswordOTPEmail;
