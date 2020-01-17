import NodeMailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = NodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendRegistrationMailTo(user) {

    const { username, email } = user;

    try {
        await transporter.sendMail({
            from: 'RESTful API <no-reply@rest.com>',
            to: `${username} <${email}>`,
            subject: 'Successful registration',
            time: new Date(),
            text: 'Plaintext version of the message',
            html: '<p>HTML version of the message</p>'
        });
    
    } catch (error) {
        console.error(error);
    }
}

export default { 
    sendRegistrationMailTo 
};
