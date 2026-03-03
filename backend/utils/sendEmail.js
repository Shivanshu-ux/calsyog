import nodemailer from 'nodemailer';

const sendRegistrationNotification = async (newUser) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this or use host/port for other services
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'calsyog@gmail.com', // Admin email
            subject: 'New User Registration Notification',
            text: `A new user has registered!\n\nName: ${newUser.name}\nEmail: ${newUser.email}`,
            html: `
                <h3>New User Registration</h3>
                <p>A new user has just signed up on your platform.</p>
                <ul>
                    <li><strong>Name:</strong> ${newUser.name}</li>
                    <li><strong>Email:</strong> ${newUser.email}</li>
                </ul>
            `,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Registration notification email sent: ${info.response}`);
    } catch (error) {
        console.error('Error sending registration notification email:', error);
    }
};

export default sendRegistrationNotification;
