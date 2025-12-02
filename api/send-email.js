import { sendContactEmail } from '../lib/email.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res
      .status(405)
      .json({ success: false, message: 'Method not allowed' });
  }

  try {
    await sendContactEmail(req.body ?? {});
    res
      .status(200)
      .json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email Error:', error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || 'Failed to send email.'
      });
  }
}

