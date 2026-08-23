'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string(),
  agree: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms'
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
      } else {
        setServerError(result.error || 'Something went wrong');
      }
    } catch (error) {
      setServerError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const renderValidationIcon = (fieldName: keyof SignupFormValues) => {
    if (!touchedFields[fieldName]) return null;
    return !errors[fieldName] ? (
      <CheckCircle2 className="h-5 w-5 text-green-500 absolute right-4 top-10" />
    ) : null;
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Editorial Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-secondary">
        <Image
          src="/auth-side.png"
          alt="Luxury Fashion"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-12 left-12 text-white z-10">
          <h2 className="text-5xl font-display mb-4">JOIN VELKORA</h2>
          <p className="text-lg font-sans tracking-widest uppercase opacity-80">
            Exclusive Access to Luxury Editorial Collections
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-display mb-2">CREATE ACCOUNT</h1>
            <p className="text-gray-500 font-sans">Enter your details to join our community.</p>
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <Input
                label="Full Name"
                placeholder="John Doe"
                {...register('name')}
                error={errors.name?.message}
              />
              {renderValidationIcon('name')}
            </div>

            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                error={errors.email?.message}
              />
              {renderValidationIcon('email')}
            </div>

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+91 98765 43210"
              {...register('phone')}
              error={errors.phone?.message}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-gray-400 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-10 text-gray-400 hover:text-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <Checkbox
              label="I agree to the Terms & Privacy Policy"
              {...register('agree')}
              error={errors.agree?.message}
            />

            <Button
              type="submit"
              className="w-full uppercase tracking-widest py-4"
              isLoading={isLoading}
              disabled={!isValid}
            >
              Create Account
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm uppercase tracking-widest">
                <span className="bg-background px-4 text-gray-500">Or Continue With</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button type="button" variant="outline" className="space-x-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Google</span>
              </Button>
              <Button type="button" variant="outline" className="space-x-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M17.05 20.28c-.96.95-2.18 1.78-3.72 1.78-1.47 0-2.31-.83-3.83-.83-1.55 0-2.5.83-3.84.83-1.48 0-2.84-.96-3.85-2.01-2.06-2.13-3.18-6.11-3.18-8.79 0-3.69 2.21-5.71 4.54-5.71 1.17 0 2.15.54 2.94.54.78 0 1.95-.6 3.34-.6 1.48 0 3.73.6 5.03 2.52-3.17 1.87-2.65 6.03.57 7.28-.68 1.83-1.56 3.51-2.5 4.5zm-3.56-15.65c0-1.92 1.62-3.48 3.55-3.48.06 1.96-1.58 3.61-3.55 3.48z"
                  />
                </svg>
                <span>Apple</span>
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500 font-sans pt-4">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="text-primary font-bold hover:underline tracking-widest uppercase"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
