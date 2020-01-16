import NodeMailer from 'nodemailer';

const transporter = NodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function sendRegistrationMailTo() {
    try {
        await transporter.sendMail({
            from: 'API <someone@mail.com>',
            to: `Fake <${process.env.SMTP_USER}>`,
            subject: 'App mail test',
            text: 'Plaintext version of the message',
            html: '<p>HTML version of the message</p>'
        });
    
    } catch (error) {
        console.error(error);
    }
}

export { sendRegistrationMailTo };
