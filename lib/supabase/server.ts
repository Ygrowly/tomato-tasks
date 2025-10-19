import type { SupabaseClient } from '@supabase/supabase-js';

// 检查环境变量是否存在
const hasSupabaseConfig = typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'string' 
                      && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
                      && typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'string'
                      && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0;

// 创建模拟服务端客户端
const createMockServerClient = () => {
  console.warn('⚠️ 服务端: 使用 Supabase 模拟客户端。请配置环境变量以启用实际功能。');
  
  // 返回一个与 SupabaseClient 接口兼容的模拟对象
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
    rpc: () => Promise.resolve({ data: null, error: null }),
  } as unknown as SupabaseClient;
};

/**
 * 创建服务端 Supabase 客户端
 * 注意：在开发阶段我们使用模拟客户端，上线后需配置环境变量
 */
export function createServerSupabaseClient(): SupabaseClient {
  // 如果没有配置，返回模拟客户端
  return createMockServerClient();
  
  // 上线时修改为：
  // 1. 安装完整的 cookies 支持
  // 2. 移除上面的 return
  // 3. 取消下面代码的注释
  
  /* 
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 })
        }
      }
    }
  );
  */
}
