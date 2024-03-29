/**
 * @module NodeMailer
 */
const APIError = require('errors/api-error');
const NodeMailer = require('nodemailer');
const dotenv = require('dotenv');
const templates = require('utils/mail/templates');
const generator = require('utils/mail/generator');

dotenv.config();
const internals = {};
/**
 * Reusable `transporter` object to send emails.
 */
internals.transporter = NodeMailer.createTransport({
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
exports.sendRegistrationMailTo = async function (user) {
    const { username, email } = user;
    const emailContent = templates.getRegistrationBody(username);
    const html = generator.generate(emailContent);
    const text = generator.generatePlaintext(emailContent);

    try {
        await internals.transporter.sendMail({
            from: 'RESTful API <no-reply@rest.com>',
            to: `${username} <${email}>`,
            subject: 'Successful registration',
            time: new Date(),
            html,
            text
        });
    } catch (error) {
        throw APIError.MAILER_ERROR(error.message);
    }
};
