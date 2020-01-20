import NodeMailer from 'nodemailer';
import dotenv from 'dotenv';
import templates from './templates';
import generator from './generator';

dotenv.config();

/** 
 * Reusable `transporter` object to send emails.
 */
const transporter = NodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
/**
 * Sends a registration email to the specified user.
 *
 * @param {Object} user - The user object from which to extract the needed details.
 */
async function sendRegistrationMailTo(user) {

    const { username, email } = user;
    const emailContent = templates.getRegistrationBody(username);
    const html = generator.generate(emailContent);
    const text = generator.generatePlaintext(emailContent);

    try {
        await transporter.sendMail({
            from: 'RESTful API <no-reply@rest.com>',
            to: `${username} <${email}>`,
            subject: 'Successful registration',
            time: new Date(),
            html,
            text
        });
    
    } catch (error) {
        console.error(error);
    }
}
/** 
 * @module NodeMailer
 */
export default { 
    sendRegistrationMailTo 
};
