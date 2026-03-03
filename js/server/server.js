const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

const corsOptions = {
    origin: '*', // Allow all origins for simplicity (you can restrict this later)
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = 3000;

// Create Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your email service provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/send-email', async (req, res) => {
    const { name, message } = req.body;

    if (!message) {
        return res.status(400).send('Message is required');
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to yourself
        subject: `New Portfolio Message from ${name}`,
        text: `You have received a new message from ${name}:\n\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).send('Email sent successfully');
        }
    });

    // Also send an auto-reply if possible? No, user just wants to receive it.
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
