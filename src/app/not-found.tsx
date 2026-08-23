import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="text-9xl font-display font-black text-gray-100">404</h1>
      <h2 className="text-3xl font-display uppercase mt-4 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="h-12 px-8 bg-black text-white uppercase tracking-widest text-xs font-bold inline-flex items-center justify-center hover:bg-black/90 transition-colors">
        Return Home
      </Link>
    </div>
  );
}
