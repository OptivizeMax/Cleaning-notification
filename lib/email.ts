import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export async function sendEmail(title: string, body: string, imageUrl?: string) {
  const site = process.env.SITE_NAME || 'Cleaning Updates';
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'updates@example.com',
      to: process.env.FROM_EMAIL || 'client@example.com',
      subject: `${site}: ${title}`,
      html: `<h1>${title}</h1><p>${body}</p>${imageUrl ? `<img src="${imageUrl}"/>` : ''}`,
    });
  } else if (process.env.SMTP_HOST) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.FROM_EMAIL,
      subject: `${site}: ${title}`,
      html: `<h1>${title}</h1><p>${body}</p>${imageUrl ? `<img src="${imageUrl}"/>` : ''}`,
    });
  }
}
