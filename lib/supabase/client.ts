import type { SupabaseClient } from '@supabase/supabase-js';

// 创建模拟客户端，所有操作都返回模拟数据
const createMockClient = (): SupabaseClient => {
  console.warn('⚠️ 使用 Supabase 模拟客户端。请配置环境变量以启用实际功能。');
  
  // 返回一个与 SupabaseClient 接口兼容的模拟对象
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signUp: () => Promise.resolve({ data: null, error: { message: '模拟客户端：无法注册' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: '模拟客户端：无法登录' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ 
        data: { subscription: { unsubscribe: () => {} } } 
      }),
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

// 创建客户端
export const createClient = (): SupabaseClient => {
  return createMockClient();
};

// 导出客户端实例
export const supabase = createClient();
