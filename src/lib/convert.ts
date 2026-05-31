import type {
  AuthJson,
  ConvertResult,
  JwtPayload,
  SessionJson,
} from "./types";

/** 解码 JWT payload（不验证签名，仅用于读取声明信息） */
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** 验证输入是否为合法的 session JSON */
function isValidSessionJson(data: unknown): data is SessionJson {
  if (typeof data !== "object" || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.accessToken === "string" &&
    obj.accessToken.length > 0 &&
    typeof obj.user === "object" &&
    obj.user !== null &&
    typeof (obj.user as Record<string, unknown>).id === "string" &&
    typeof obj.expires === "string"
  );
}

/** 从 JWT payload 或 groups 中提取套餐类型 */
function extractPlan(data: SessionJson, payload: JwtPayload | null): string {
  // 优先从 JWT 中读取
  const authClaim = payload?.["https://api.openai.com/auth"];
  if (authClaim?.chatgpt_plan_type) {
    return authClaim.chatgpt_plan_type;
  }

  // 回退到 groups 字段
  const groups = data.user.groups ?? [];
  const planGroup = groups.find(
    (g: string) =>
      g.startsWith("plan-") || g.includes("plus") || g.includes("pro") || g.includes("team")
  );
  if (planGroup) return planGroup.replace("plan-", "");
  if (groups.some((g: string) => g.includes("chatgptplus"))) return "Plus";
  return "Free";
}

/** 生成 id_token：构造一个包含关键声明信息的合成 JWT（header.payload，无签名） */
function buildIdToken(data: SessionJson, payload: JwtPayload | null): string {
  const authClaim = payload?.["https://api.openai.com/auth"];
  const profileClaim = payload?.["https://api.openai.com/profile"];

  const idPayload = {
    iat: Math.floor(Date.now() / 1000),
    exp: new Date(data.expires).getTime() / 1000,
    "https://api.openai.com/auth": {
      chatgpt_account_id:
        authClaim?.chatgpt_account_id ?? data.user.id,
      chatgpt_plan_type:
        authClaim?.chatgpt_plan_type ?? "free",
      chatgpt_user_id:
        authClaim?.chatgpt_user_id ?? data.user.id,
      user_id:
        authClaim?.user_id ?? data.user.id,
    },
    email: profileClaim?.email ?? data.user.email,
  };

  // header: alg=none, typ=JWT, cpa_synthetic=true（标记为合成 token）
  const header = btoa(JSON.stringify({
    alg: "none",
    typ: "JWT",
    cpa_synthetic: true,
  }))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const body = btoa(
    JSON.stringify(idPayload)
      .split("")
      .map((c) => String.fromCharCode(c.charCodeAt(0)))
      .join("")
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${header}.${body}.synthetic`;
}

/** 将 session JSON 转换为 Codex auth.json 格式 */
export function convertSessionToAuth(sessionRaw: string): ConvertResult {
  const trimmed = sessionRaw.trim();
  if (trimmed.length === 0) {
    return {
      success: false,
      authJson: null,
      accountInfo: null,
      error: "请输入 session JSON 数据",
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return {
      success: false,
      authJson: null,
      accountInfo: null,
      error: "JSON 格式无效，请检查输入内容",
    };
  }

  if (!isValidSessionJson(parsed)) {
    return {
      success: false,
      authJson: null,
      accountInfo: null,
      error: "输入不是有效的 ChatGPT session JSON，缺少必要字段",
    };
  }

  // 解码 access_token 的 JWT payload 以提取更多信息
  const jwtPayload = decodeJwtPayload(parsed.accessToken);
  const authClaim = jwtPayload?.["https://api.openai.com/auth"];

  // 获取 account_id：优先从 JWT 获取
  const accountId =
    authClaim?.chatgpt_account_id ?? parsed.user.id;

  // 生成 id_token
  const idToken = buildIdToken(parsed, jwtPayload);

  const authJson: AuthJson = {
    auth_mode: "chatgpt",
    OPENAI_API_KEY: null,
    tokens: {
      id_token: idToken,
      access_token: parsed.accessToken,
      refresh_token: "",
      account_id: accountId,
    },
    last_refresh: new Date().toISOString(),
  };

  const accountInfo = {
    name: parsed.user.name || "未返回",
    email: parsed.user.email || "未返回",
    plan: extractPlan(parsed, jwtPayload),
    accountId: accountId || "未返回",
  };

  return {
    success: true,
    authJson: JSON.stringify(authJson, null, 2),
    accountInfo,
    error: null,
  };
}

/** 将文件内容触发浏览器下载 */
export function downloadAuthJson(content: string, filename: string = "auth.json"): void {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** 复制文本到剪贴板 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** 从剪贴板读取文本 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    return await navigator.clipboard.readText();
  } catch {
    return null;
  }
}
