import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP verification error:', error);
    } else {
        console.log(success, 'Server is ready to take messages');
    }
});

export default transporter;