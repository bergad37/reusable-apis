import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// API endpoint to send email
app.post('/send-email', async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject,
      html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
  <h2 style="color: #2c3e50; margin-bottom: 10px;">📩 New Client Inquiry</h2>

  <p>A new message has been submitted through the website contact form. Below are the client details:</p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

  <h3 style="color: #2c3e50; margin-bottom: 5px;">👤 Client Information</h3>
  <p><strong>Full Name:</strong> ${firstName} ${lastName}</p>
  <p><strong>Email Address:</strong> ${email}</p>
  <p><strong>Phone Number:</strong> ${phone || 'Not provided'}</p>

  <h3 style="color: #2c3e50; margin-top: 20px; margin-bottom: 5px;">📝 Message Details</h3>
  <p><strong>Subject:</strong> ${subject}</p>
  <p>Hello DC support team</p>

  <div style="padding: 12px; background: #f7f7f7; border-left: 4px solid #2c3e50; margin-top: 8px; white-space: pre-line;">
    ${message}
  </div>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;" />

  <p style="font-size: 13px; color: #777;">
    This message was automatically generated from the website contact form.
  </p>
</div>

  `
    });

    res
      .status(200)
      .json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
