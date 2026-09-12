const nodemailer = require('nodemailer');

// Vercel usually parses JSON bodies, but guard against undefined/string bodies.
function parseBody(req) {
    if (!req.body) return {};
    if (typeof req.body === 'string') {
        try { return JSON.parse(req.body); } catch { return {}; }
    }
    return req.body;
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, message } = parseBody(req);

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email and message are required' });
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Missing EMAIL_USER / EMAIL_PASS environment variables');
        return res.status(500).json({ error: 'Email service is not configured' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: `${name} <${email}>`,
            subject: `Portfolio Message from ${name}`,
            text: `New message from ${name} <${email}>:\n\n${message}`,
        });
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Email send error:', error);
        return res.status(500).json({ error: 'Failed to send email' });
    }
};
