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

const sendContactUsMail = async (mailDetailsToFire: any) => {
    try {
        const transporter = nodemailer.createTransport(emailConfiguration);
        const mailBody = `Hi Admin, 
                            <br />This is <b>${mailDetailsToFire.name}</b>.
                            <br />Please reach out to us at <b>${mailDetailsToFire.customerEmail}</b> to discuss more about ${mailDetailsToFire.subject}<br />
                            <br />Here is the glimpse of discussion:<p>${mailDetailsToFire.message}</p>
                            <br />
                            <b>Thanks and Regards</b>
                            <br />
                            <b>${mailDetailsToFire.name}</b>`;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.ADMIN_EMAIL_ABOUT_CUSTOMER,
            subject: mailDetailsToFire.subject,
            html: mailBody,
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.log('Error in sending Email at services: ', error);
        return error;
    }
}

const sendThankYouEmailToCustomer = async (mailDetailsToFire: any) => {
    try {
        const transporter = nodemailer.createTransport(emailConfiguration);
        const mailBody = `Hi <b>${mailDetailsToFire.name}</b>,
                            <br /><br />
                            Thank you for reaching out to us!
                            <br /><br />
                            We have received your message regarding "<b>${mailDetailsToFire.subject}</b>" and our team will contact you soon.
                            <br /><br />
                            <b>Thanks and Regards</b>
                            <br />
                            <b>Team iGlobusJobSetu</b>`;

        const mailOptions = {
            from: process.env.ADMIN_EMAIL_ABOUT_CUSTOMER,
            to: mailDetailsToFire.customerEmail,
            subject: `Re: ${mailDetailsToFire.subject}`,
            html: mailBody,
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.log('Error in sending thank you email to customer: ', error);
        return error;
    }
}

export default { sendContactUsMail, sendThankYouEmailToCustomer };