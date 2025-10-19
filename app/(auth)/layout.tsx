import Link from 'next/link';
import { Clock } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 border-b">
        <div className="container max-w-7xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">番茄时钟</span>
          </Link>
        </div>
      </header>
      <div className="flex-1 flex">
        {children}
      </div>
      <footer className="py-4 border-t">
        <div className="container max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} 番茄时钟 - 专注工作法
        </div>
      </footer>
    </div>
  );
}
