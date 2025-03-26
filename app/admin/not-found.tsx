import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-4">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        href="/admin"
        className="btn btn-primary"
      >
        Return to Dashboard
      </Link>
    </div>
  );
} 