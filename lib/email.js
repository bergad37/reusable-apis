import nodemailer from 'nodemailer';

let transporter;

function ensureEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const host = ensureEnv('EMAIL_HOST');
  const port = Number(ensureEnv('EMAIL_PORT'));
  const user = ensureEnv('EMAIL_USER');
  const pass = ensureEnv('EMAIL_PASS');
  const secure = (process.env.EMAIL_SECURE ?? 'false').toLowerCase() === 'true';

  transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    }
  });

  return transporter;
}

export async function sendContactEmail({
  firstName = '',
  lastName = '',
  email,
  phone,
  subject,
  message
}) {
  if (!email || !subject || !message) {
    throw new Error(
      'Missing required fields: email, subject, and message are required.'
    );
  }

  const mailOptions = {
    from: `"Website Contact" <${ensureEnv('EMAIL_USER')}>`,
    replyTo: email,
    to: ensureEnv('EMAIL_USER'),
    subject,
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
  <h2 style="color: #2c3e50; margin-block-end: 10px;">📩 New Client Inquiry</h2>

  <p>A new message has been submitted through the website contact form. Below are the client details:</p>

  <hr style="border: none; border-block-start: 1px solid #ddd; margin: 20px 0;" />

  <h3 style="color: #2c3e50; margin-block-end: 5px;">👤 Client Information</h3>
  <p><strong>Full Name:</strong> ${firstName} ${lastName}</p>
  <p><strong>Email Address:</strong> ${email}</p>
  <p><strong>Phone Number:</strong> ${phone || 'Not provided'}</p>

  <h3 style="color: #2c3e50; margin-block-start: 20px; margin-block-end: 5px;">📝 Message Details</h3>
  <p><strong>Subject:</strong> ${subject}</p>
  <p>Hello DC Survey support team</p>

  <div style="padding: 12px; background: #f7f7f7; border-inline-start: 4px solid #2c3e50; margin-block-start: 8px; white-space: pre-line;">
    ${message}
  </div>

  <hr style="border: none; border-block-start: 1px solid #ddd; margin: 25px 0;" />

  <p style="font-size: 13px; color: #777;">
    This message was automatically generated from the website contact form.
  </p>
</div>

  `
  };

  await getTransporter().sendMail(mailOptions);
}
