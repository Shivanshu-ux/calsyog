import nodemailer from 'nodemailer';

const sendHelpEmail = async (helpRequest) => {
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
            to: 'calsyog@gmail.com', // Admin email
            subject: `[Help Request] ${helpRequest.subject}`,
            text: `You have received a new help request.\n\nFrom: ${helpRequest.name} (${helpRequest.email})\nSubject: ${helpRequest.subject}\n\nDescription:\n${helpRequest.description}`,
            html: `
                <h3>New Help Request Submitted</h3>
                <p>A user has submitted an inquiry on the Help page.</p>
                <ul>
                    <li><strong>Name:</strong> ${helpRequest.name}</li>
                    <li><strong>Email:</strong> ${helpRequest.email}</li>
                    <li><strong>Subject:</strong> ${helpRequest.subject}</li>
                </ul>
                <h4>Description:</h4>
                <p style="white-space: pre-wrap;">${helpRequest.description}</p>
            `,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Help request email sent: ${info.response}`);
    } catch (error) {
        console.error('Error sending help request email:', error);
    }
};

export default sendHelpEmail;
