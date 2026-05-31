import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codex Auth JSON 生成器",
  description:
    "将已登录的 ChatGPT session 转换为 Codex 可用的 auth.json 文件，本地处理，安全可靠。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* 阻塞脚本：首次绘制前根据 localStorage 或系统偏好设置正确的 CSS 变量，避免主题闪烁 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=t!=="light"&&t!=="dark"&&matchMedia("(prefers-color-scheme:light)").matches?"light":t;if(d==="light"){var s=document.documentElement.style;var v={"--background":"#f8fafc","--foreground":"#1e293b","--card":"#ffffff","--card-border":"#e2e8f0","--primary":"#6366f1","--primary-hover":"#4f46e5","--accent":"#0891b2","--success":"#059669","--error":"#dc2626","--muted":"#64748b","--input-bg":"#f1f5f9","--logo-text":"#ffffff"};for(var k in v)s.setProperty(k,v[k])}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
