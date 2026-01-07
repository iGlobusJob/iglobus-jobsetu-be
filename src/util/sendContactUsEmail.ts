import createEmailTransporter from './emailConfig';

const sendContactUsMail = async (mailDetailsToFire: any) => {
    try {
        const transporter = createEmailTransporter();
        const mailBody = `Hi Admin, 
                            <br />This is <b>${mailDetailsToFire.name}</b>.
                            <br />Please reach out to us at <b>${mailDetailsToFire.customerEmail}</b> to discuss more about ${mailDetailsToFire.subject}<br />
                            <br />Here is the glimpse of discussion:<p>${mailDetailsToFire.message}</p>
                            <br />
                            <b>Regards</b>
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
        console.error('Error in sending Email at services: ', error);
        return error;
    }
}

const sendThankYouEmailToCustomer = async (mailDetailsToFire: any) => {
    try {
        const transporter = createEmailTransporter();
        const mailBody = `Hi <b>${mailDetailsToFire.name}</b>,
                            <br /><br />
                            Thank you for reaching out to us!
                            <br /><br />
                            We have received your message regarding "<b>${mailDetailsToFire.subject}</b>" and our team will contact you soon.
                            <br /><br />
                            <b>Regards</b>
                            <br />
                            <b>Team iGlobus JobSetu.</b>`;

        const mailOptions = {
            from: process.env.ADMIN_EMAIL_ABOUT_CUSTOMER,
            to: mailDetailsToFire.customerEmail,
            subject: `Re: ${mailDetailsToFire.subject}`,
            html: mailBody,
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error(`Error in sending thank you email to customer: ${error}`);
        return error;
    }
}

export default { sendContactUsMail, sendThankYouEmailToCustomer };