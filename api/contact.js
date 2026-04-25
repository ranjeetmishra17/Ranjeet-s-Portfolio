import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, edit_type, message } = req.body;

  if (!name || !email || !edit_type) {
    return res.status(400).json({ error: 'Name, email, and edit type are required.' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Resend's default free testing domain
      to: 'ranjittmishra21@gmail.com', // Your actual receiving email address
      subject: `New Portfolio Inquiry from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Edit Type:</strong> ${edit_type}</p>
        <p><strong>Message:</strong><br/>${message || 'No additional details provided.'}</p>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(400).json({ error });
    }

    return res.status(200).json({ success: 'Message sent successfully!', data });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
}
