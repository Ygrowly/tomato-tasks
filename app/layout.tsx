import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from "@/lib/contexts/QueryClientProvider";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { TimerProvider } from "@/lib/contexts/TimerContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "番茄时钟 - 专注工作法",
  description: "一个番茄工作量化法应用，帮助用户提高专注力和工作效率",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <QueryClientProvider>
          <AuthProvider>
            <TimerProvider>
              {children}
            </TimerProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
