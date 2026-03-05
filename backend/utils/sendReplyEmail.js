import nodemailer from 'nodemailer';

const sendReplyEmail = async ({ toEmail, subject, text, html }) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: subject,
            text: text,
            html: html,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Reply email sent to ${toEmail}: ${info.response}`);
    } catch (error) {
        console.error('Error sending reply email:', error);
    }
};

export default sendReplyEmail;
