import nodemailer from 'nodemailer';
import { getWelcomeEmailHTML } from './emailTemplates.js';

export default async function handler(req, res) {
  // Add CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Create SMTP transport using real credentials provided earlier
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'transmission@theshriks.space',
        pass: 'vnfc vaxh afsx zfox'
      }
    });

    // Send welcome email
    const mailOptions = {
      from: '"OpenDeck of The Shriks" <transmission@theshriks.space>',
      to: email,
      subject: 'Welcome to OpenDeck!',
      html: getWelcomeEmailHTML()
    };
    
    await transport.sendMail(mailOptions);

    // Note for production:
    // In a real Vercel environment, you should save the email to a proper DB like Vercel KV, Supabase, or MongoDB here.
    // Local filesystem writes (fs.writeFileSync) do NOT persist in Serverless functions.

    return res.status(200).json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: 'Failed to send transmission' });
  }
}
