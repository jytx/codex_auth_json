/** Hero 区域：标题、描述、安全特性 */
export default function HeroSection() {
  const features = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "本地处理",
      desc: "数据不上云，不存储",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      ),
      title: "隐私安全",
      desc: "浏览器本地完成",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      title: "快速生成",
      desc: "减少重复登录验证",
    },
  ];

  return (
    <section className="pb-10 pt-12 sm:pt-16">
      <h1 className="mx-auto max-w-3xl text-center text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
        Codex Auth JSON{" "}
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          生成器
        </span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted sm:text-base">
        把已登录的 ChatGPT session 转成 Codex 可用的 auth.json，减少登录时手机号验证和接码的麻烦。
        <br />
        粘贴 session JSON 后在浏览器本地生成文件，页面不会上传、保存或存储您的数据。
      </p>

      {/* 安全特性 */}
      <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex flex-col items-center gap-2 rounded-xl border border-card-border bg-card/50 p-4 text-center"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {f.icon}
            </div>
            <span className="text-xs font-semibold text-foreground sm:text-sm">{f.title}</span>
            <span className="text-[11px] text-muted">{f.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
