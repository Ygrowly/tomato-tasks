'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { signUp } = useAuth();
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      setIsLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError('密码长度至少为6位');
      setIsLoading(false);
      return;
    }
    
    try {
      await signUp(email, password);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error) {
      console.error('Signup error:', error);
      setError('注册失败，请稍后再试或尝试使用其他邮箱');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">注册番茄时钟账号</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            创建一个账号以开始管理您的任务和时间
          </p>
        </div>
        
        {success ? (
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-green-700 text-center font-medium">
              注册成功！请查收验证邮件，正在跳转到登录页面...
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  邮箱地址
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="您的邮箱地址"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  密码
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="至少6位密码"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                  确认密码
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="再次输入密码"
                />
              </div>
            </div>
            
            {error && (
              <div className="text-sm text-red-500 text-center">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            >
              {isLoading ? '注册中...' : '注册账号'}
            </button>
            
            <div className="text-center text-sm">
              已经有账号？{' '}
              <Link href="/login" className="text-primary hover:underline">
                前往登录
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
