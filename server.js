import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getWelcomeEmailHTML, getUpdateEmailHTML } from './emailTemplates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const DB_FILE = path.join(__dirname, 'subscribers.json');
const EMAILS_LOG = path.join(__dirname, 'sent_emails.json');

// Initialize local DB files if they don't exist
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify([]));
if (!fs.existsSync(EMAILS_LOG)) fs.writeFileSync(EMAILS_LOG, JSON.stringify([]));

// Create SMTP transport using real credentials
const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'transmission@theshriks.space',
    pass: 'vnfc vaxh afsx zfox'
  }
});

// Helper to log emails locally
const logEmailLocally = (mailOptions, info) => {
  try {
    const logs = JSON.parse(fs.readFileSync(EMAILS_LOG, 'utf8'));
    logs.push({
      timestamp: new Date().toISOString(),
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
      messageId: info.messageId
    });
    fs.writeFileSync(EMAILS_LOG, JSON.stringify(logs, null, 2));
    console.log(`[Email Mock] Sent email to ${mailOptions.to}`);
  } catch (err) {
    console.error('Failed to log email', err);
  }
};

app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const subscribers = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      fs.writeFileSync(DB_FILE, JSON.stringify(subscribers, null, 2));
      
      // Send welcome email
      const mailOptions = {
        from: '"OpenDeck of The Shriks" <transmission@theshriks.space>',
        to: email,
        subject: 'Welcome to OpenDeck!',
        html: getWelcomeEmailHTML()
      };
      
      transport.sendMail(mailOptions, (err, info) => {
        if (!err) logEmailLocally(mailOptions, info);
      });
    }
    res.json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin endpoint to simulate an update and notify all users
app.post('/api/notify', (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) return res.status(400).json({ error: 'Title and message are required' });

  try {
    const subscribers = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    
    subscribers.forEach(email => {
      const mailOptions = {
        from: '"OpenDeck of The Shriks" <transmission@theshriks.space>',
        to: email,
        subject: `[OpenDeck Update] ${title}`,
        html: getUpdateEmailHTML(title, message)
      };
      
      transport.sendMail(mailOptions, (err, info) => {
        if (!err) logEmailLocally(mailOptions, info);
      });
    });

    res.json({ success: true, message: `Notification sent to ${subscribers.length} subscribers` });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Local Email Mock API running on http://localhost:${PORT}`);
});
