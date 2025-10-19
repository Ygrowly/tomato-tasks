import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 检查用户是否已认证
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next();
  
  try {
    // 简单的会话检查 - 查看是否有 Supabase auth cookie
    const hasSession = request.cookies.has('sb-access-token') || 
                      request.cookies.has('sb-refresh-token') ||
                      request.cookies.has('sb-auth-token');

    // 路由规则
    const isLoginPage = request.nextUrl.pathname.startsWith('/login');
    const isSignupPage = request.nextUrl.pathname.startsWith('/signup');
    
    // 公共路径
    const isPublicPath = 
      request.nextUrl.pathname === '/' || // 首页可以公开访问
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.startsWith('/public') ||
      request.nextUrl.pathname.includes('.'); // 静态资源

    // 保护路径
    const isProtectedPath = !isPublicPath && !isLoginPage && !isSignupPage;

    // 临时屏蔽身份验证以方便开发
    const bypassAuth = true; // 开发阶段设置为true
    
    if (!bypassAuth) {
      // 如果用户未登录且尝试访问受保护的路由
      if (!hasSession && isProtectedPath) {
        console.log('未认证用户访问受保护路径:', request.nextUrl.pathname);
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }

      // 如果用户已登录且尝试访问登录/注册页面
      if (hasSession && (isLoginPage || isSignupPage)) {
        console.log('已认证用户尝试访问登录页');
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  } catch (error) {
    console.error('中间件错误:', error);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
