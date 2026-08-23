'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account verified successfully!');
        setTimeout(() => {
          router.push('/auth/signin?registered=true');
        }, 2000);
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setSuccess('OTP resent successfully!');
      } else {
        setError('Failed to resend OTP.');
      }
    } catch (err) {
      setError('Failed to resend OTP.');
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">No email provided for verification.</p>
          <Link href="/auth/signup" className="text-primary hover:underline font-bold uppercase tracking-widest text-xs">
            Back to Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-display mb-2 uppercase">Verify Email</h1>
          <p className="text-gray-500 font-sans">
            We've sent a 6-digit verification code to <span className="font-bold">{email}</span>.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <Input
            label="Verification Code"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
            className="text-center text-2xl tracking-widest"
          />

          <Button type="submit" className="w-full uppercase tracking-widest py-4" isLoading={isLoading} disabled={otp.length !== 6}>
            Verify Account
          </Button>

          <p className="text-center text-sm text-gray-500 pt-4">
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResend}
              className="text-primary font-bold hover:underline tracking-widest uppercase"
            >
              Resend OTP
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
