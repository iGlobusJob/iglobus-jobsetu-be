"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emailConfig_1 = __importDefault(require("./emailConfig"));
const sendContactUsMail = async (mailDetailsToFire) => {
    try {
        const transporter = (0, emailConfig_1.default)();
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
    }
    catch (error) {
        console.error('Error in sending Email at services: ', error);
        return error;
    }
};
const sendThankYouEmailToCustomer = async (mailDetailsToFire) => {
    try {
        const transporter = (0, emailConfig_1.default)();
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
    }
    catch (error) {
        console.error('Error in sending thank you email to customer: ', error);
        return error;
    }
};
exports.default = { sendContactUsMail, sendThankYouEmailToCustomer };
