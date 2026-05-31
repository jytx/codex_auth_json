"use client";

import { useCallback, useEffect, useState } from "react";
import {
  convertSessionToAuth,
  copyToClipboard,
  downloadAuthJson,
  readFromClipboard,
} from "@/lib/convert";
import type { AccountInfo, ConvertResult } from "@/lib/types";

/** JSON 输入与转换区域 */
export default function JsonInputCard() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [copied, setCopied] = useState(false);

  // 输入变化时自动转换
  useEffect(() => {
    if (input.trim().length === 0) {
      setResult(null);
      return;
    }

    // 防抖：300ms 后自动转换
    const timer = setTimeout(() => {
      setResult(convertSessionToAuth(input));
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  const handlePasteFromClipboard = useCallback(async () => {
    const text = await readFromClipboard();
    if (text) {
      setInput(text);
    }
  }, []);

  const handleClear = useCallback(() => {
    setInput("");
    setResult(null);
  }, []);

  const handleCopy = useCallback(async () => {
    if (result?.authJson) {
      const ok = await copyToClipboard(result.authJson);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  }, [result]);

  const handleDownload = useCallback(() => {
    if (result?.authJson) {
      downloadAuthJson(result.authJson);
    }
  }, [result]);

  return (
    <div className="space-y-6" id="guide">
      {/* 输入区域 */}
      <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-foreground">粘贴 ChatGPT session JSON</h2>
          <a
            href="https://chatgpt.com/api/auth/session"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary transition-colors hover:text-primary-hover"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            获取 session JSON
          </a>
        </div>

        <p className="mb-3 text-xs text-muted sm:text-sm">
          从已登录的 ChatGPT 网页应用中复制 session JSON，粘贴后即可生成 Codex 登录所需文件。
        </p>

        <textarea
          className="code-block h-40 w-full resize-y text-sm sm:h-48"
          placeholder="在此粘贴您的 session JSON 数据..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={handlePasteFromClipboard}
            className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 sm:text-sm"
          >
            从剪贴板粘贴
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg bg-card-border/50 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-card-border sm:text-sm"
          >
            清空
          </button>
        </div>

        {/* 状态提示 */}
        <div className="mt-4 flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              result?.success
                ? "bg-success"
                : result?.error
                  ? "bg-error"
                  : "bg-muted/50"
            }`}
          />
          <span className="text-xs text-muted">
            {result?.success
              ? "转换成功"
              : result?.error
                ? result.error
                : input.trim()
                  ? "正在解析..."
                  : "粘贴 session JSON 后会自动生成 auth.json"}
          </span>
        </div>
      </div>

      {/* 生成结果区域 */}
      {result?.success && result.authJson && (
        <div className="animate-fade-in space-y-4">
          <ResultCard
            authJson={result.authJson}
            accountInfo={result.accountInfo}
            copied={copied}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />
          <PathGuide />
          <SecurityNote />
        </div>
      )}
    </div>
  );
}

/** 生成结果展示卡片 */
function ResultCard({
  authJson,
  accountInfo,
  copied,
  onCopy,
  onDownload,
}: {
  authJson: string;
  accountInfo: AccountInfo | null;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
}) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">生成结果</h2>
      <p className="mb-4 text-xs text-muted sm:text-sm">
        您的 auth.json 文件已生成，可以复制或下载。
      </p>

      {/* 账号信息 */}
      {accountInfo && <AccountInfoTable info={accountInfo} />}

      {/* 操作按钮 */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          {copied ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              已复制
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              复制 auth.json
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-2 rounded-lg border border-card-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-card-border"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          下载 auth.json
        </button>
      </div>

      {/* JSON 预览 */}
      <details className="mt-4">
        <summary className="cursor-pointer text-xs text-muted hover:text-foreground">
          查看 JSON 内容
        </summary>
        <pre className="code-block mt-2 max-h-60 overflow-auto text-xs">{authJson}</pre>
      </details>
    </div>
  );
}

/** 账号信息表格 */
function AccountInfoTable({ info }: { info: AccountInfo }) {
  const rows = [
    { label: "名称", value: info.name },
    { label: "邮箱", value: info.email },
    { label: "套餐", value: info.plan },
    { label: "账号 ID", value: info.accountId },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {rows.map((row) => (
        <div key={row.label} className="rounded-lg bg-input-bg p-3">
          <div className="text-[11px] text-muted">{row.label}</div>
          <div className="mt-0.5 truncate text-xs font-medium text-foreground">{row.value}</div>
        </div>
      ))}
    </div>
  );
}

/** 文件放置路径说明 */
function PathGuide() {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-6">
      <h3 className="mb-3 text-base font-semibold text-foreground">auth.json 放置位置</h3>
      <p className="mb-4 text-xs text-muted sm:text-sm">
        下载后请将文件命名为 <code className="rounded bg-input-bg px-1.5 py-0.5 font-mono text-primary">auth.json</code>
        ，并放到对应系统的 Codex 配置目录中。
      </p>
      <div className="space-y-2">
        <PathItem os="Windows" path="%USERPROFILE%\.codex\auth.json" />
        <PathItem os="macOS" path="~/.codex/auth.json" />
      </div>
    </div>
  );
}

function PathItem({ os, path }: { os: string; path: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-input-bg px-4 py-2.5">
      <span className="shrink-0 text-xs font-semibold text-foreground">{os}</span>
      <code className="truncate font-mono text-xs text-accent">{path}</code>
    </div>
  );
}

/** 安全提示 */
function SecurityNote() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
      <svg
        className="mt-0.5 shrink-0 text-accent"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <p className="text-xs text-muted">
        请妥善保管您的 auth.json 文件，不要把它发送给他人。
      </p>
    </div>
  );
}
