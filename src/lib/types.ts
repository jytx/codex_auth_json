/** ChatGPT session JSON 的原始结构 */
export interface SessionJson {
  user: {
    id: string;
    name: string;
    email: string;
    groups: string[];
    orgs: {
      id: string;
      name: string;
      role: string;
    }[];
    interop_user: string;
    email_verified: boolean;
    phone_number?: string;
  };
  expires: string;
  accessToken: string;
  authProvider: string;
}

/** Codex auth.json 的目标结构（Codex 实际所需格式） */
export interface AuthJson {
  auth_mode: string;
  OPENAI_API_KEY: string | null;
  tokens: {
    id_token: string;
    access_token: string;
    refresh_token: string;
    account_id: string;
  };
  last_refresh: string;
}

/** 从 JWT 中解析出的 payload */
export interface JwtPayload {
  "https://api.openai.com/auth"?: {
    chatgpt_account_id?: string;
    chatgpt_plan_type?: string;
    chatgpt_user_id?: string;
    user_id?: string;
  };
  "https://api.openai.com/profile"?: {
    email?: string;
    email_verified?: boolean;
  };
  exp?: number;
  iat?: number;
  email?: string;
}

/** 从 session JSON 中提取的账号摘要信息 */
export interface AccountInfo {
  name: string;
  email: string;
  plan: string;
  accountId: string;
}

/** 转换结果 */
export interface ConvertResult {
  success: boolean;
  authJson: string | null;
  accountInfo: AccountInfo | null;
  error: string | null;
}
