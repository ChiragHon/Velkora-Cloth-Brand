'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-8">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center animate-bounce">
              <Mail className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-display">CHECK YOUR EMAIL</h1>
          <p className="text-gray-500 font-sans">
            We've sent a password reset link to your email address. Please follow the instructions to reset your password.
          </p>
          <Link href="/auth/signin" className="w-full uppercase tracking-widest border border-primary text-primary hover:bg-primary hover:text-white inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98] px-6 py-3 text-base">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-display mb-2">FORGOT PASSWORD?</h1>
          <p className="text-gray-500 font-sans">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Button type="submit" className="w-full uppercase tracking-widest py-4" isLoading={isLoading}>
            Send Reset Link
          </Button>

          <Link
            href="/auth/signin"
            className="flex items-center justify-center space-x-2 text-sm uppercase tracking-widest font-bold text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sign In</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
