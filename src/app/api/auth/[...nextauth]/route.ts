import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth/next';
import { NextRequest } from 'next/server';

const handler = NextAuth(authOptions);

export async function GET(req: NextRequest, props: { params: Promise<{ nextauth: string[] }> }) {
  return handler(req, { params: await props.params });
}

export async function POST(req: NextRequest, props: { params: Promise<{ nextauth: string[] }> }) {
  return handler(req, { params: await props.params });
}
