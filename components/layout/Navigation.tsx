'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListTodo, BarChart, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';

export function Navigation() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    { name: '今日聚焦', href: '/', icon: Home },
    { name: '任务管理', href: '/tasks', icon: ListTodo },
    { name: '数据统计', href: '/stats', icon: BarChart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background z-50 md:relative md:top-0 md:border-t-0 md:border-r md:h-screen md:w-64">
      <div className="flex justify-around md:flex-col md:justify-start md:h-full md:p-4">
        {/* Logo and app name - only visible on desktop */}
        <div className="hidden md:flex items-center gap-2 mb-8 mt-4">
          <Clock className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">番茄时钟</span>
        </div>
        
        {/* Nav links */}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 py-3 px-2 rounded-md transition-colors md:mb-2",
                isActive 
                  ? "text-primary bg-muted" 
                  : "text-muted-foreground hover:text-primary hover:bg-muted/50"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="hidden md:inline">{item.name}</span>
            </Link>
          );
        })}

        {/* User menu - mobile version shows just icon */}
        <div className="flex items-center gap-2 py-3 px-2 md:mt-auto">
          <User className="h-5 w-5 text-muted-foreground" />
          <div className="hidden md:block">
            {user ? (
              <div className="flex flex-col">
                <span className="text-sm truncate max-w-40">{user.email}</span>
                <button 
                  onClick={() => signOut()}
                  className="text-xs text-muted-foreground hover:text-primary text-left"
                >
                  退出登录
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-sm text-primary">
                登录
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
