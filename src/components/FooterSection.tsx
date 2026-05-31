/** 常见问题区域 */
export function FaqSection() {
  return (
    <section className="py-12" id="faq">
      <h2 className="mb-6 text-xl font-bold text-foreground">常见问题</h2>
      <div className="space-y-4">
        <FaqItem
          question="这个工具适合什么场景？"
          answer="适合已经能登录 ChatGPT 网页，但在 Codex 登录时遇到手机号验证或接码不方便的情况。您粘贴的 session JSON 只会在当前浏览器中处理，站点不会保存输入内容。"
        />
        <FaqItem
          question="我的数据安全吗？"
          answer="完全安全。所有数据转换都在您的浏览器本地完成，不会上传到任何服务器。关闭页面后，所有输入数据都会被清除。"
        />
        <FaqItem
          question="session JSON 从哪里获取？"
          answer="在已登录 ChatGPT 的浏览器中访问 chatgpt.com/api/auth/session，复制页面返回的 JSON 内容即可。"
        />
      </div>
    </section>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-card-border bg-card">
      <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-foreground transition-colors hover:text-primary sm:text-base">
        {question}
      </summary>
      <p className="px-5 pb-4 text-xs leading-relaxed text-muted sm:text-sm">{answer}</p>
    </details>
  );
}

/** 关于区域 */
export function AboutSection() {
  return (
    <section className="py-12" id="about">
      <h2 className="mb-4 text-xl font-bold text-foreground">关于</h2>
      <p className="text-sm leading-relaxed text-muted">
        这是一个用于将 ChatGPT session JSON 转换为 Codex 登录凭据文件的小工具。
        本工具由浏览器本地运行，不收集任何用户数据。
      </p>
    </section>
  );
}

/** 页脚 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-card-border py-6">
      <p className="text-center text-xs text-muted">
        &copy; {new Date().getFullYear()} Codex Auth JSON 生成器 &middot; 本地运行 &middot; MIT License
      </p>
    </footer>
  );
}
