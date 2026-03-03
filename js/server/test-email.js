require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Test from Your Portfolio Setup!`,
    text: `Your Vercel deployment credentials are authenticated and working perfectly!`
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('FAILED:', error.message);
        process.exit(1);
    } else {
        console.log('SUCCESS:', info.response);
        process.exit(0);
    }
});
