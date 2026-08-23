import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { OtpTemplate } from '@/components/email/OtpTemplate';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user already exists and is verified
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.emailVerified) {
      return NextResponse.json({ error: 'User already exists and is verified' }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store in DB
    await prisma.otp.upsert({
      where: {
        email_code: { email, code: otp },
      },
      update: { code: otp, expiresAt },
      create: { email, code: otp, expiresAt },
    });

    // We can also delete older OTPs for this email to be safe, but let's just keep it simple.
    await prisma.otp.deleteMany({
      where: {
        email,
        expiresAt: { lt: new Date() }
      }
    });

    // Send Email (only if SMTP is configured, otherwise simulate)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const emailHtml = await render(OtpTemplate({ code: otp, name: name || 'User' }));

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"VELKORA" <noreply@velkora.com>',
        to: email,
        subject: 'Your Velkora Verification Code',
        html: emailHtml,
      });
    } else {
      console.log(`[SIMULATED OTP] Email: ${email}, OTP: ${otp}`);
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error: any) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
