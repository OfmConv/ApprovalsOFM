export interface JwtPayload {
  exp?: number;
  iat?: number;
  nkp?: string;
  is_admin?: boolean;
  [key: string]: unknown;
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const decoded = atob(padded);
  try {
    return decodeURIComponent(
      decoded
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
  } catch {
    return decoded;
  }
}

export function decodeJWT(token: string | null | undefined): JwtPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string | null | undefined): boolean {
  const payload = decodeJWT(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}