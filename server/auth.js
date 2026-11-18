// Minimal, dependency-free admin sessions: a signed, HttpOnly cookie.
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "adc_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;
const PASSWORD = process.env.ADMIN_PASSWORD;
const SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  (PASSWORD ? `${PASSWORD}::arizona-development-center` : "dev-only-insecure-secret");

export const adminConfigured = Boolean(PASSWORD);

function sign(value) {
  return createHmac("sha256", SECRET).update(value).digest("base64url");
}

export function createSessionToken() {
  const payload = `admin.${Date.now() + MAX_AGE_SECONDS * 1000}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [scope, expires, signature] = parts;
  if (scope !== "admin") return false;
  if (!expires || Number(expires) < Date.now()) return false;
  const expected = sign(`${scope}.${expires}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function readSession(req) {
  const header = req?.headers?.cookie || "";
  const match = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return match ? decodeURIComponent(match.slice(COOKIE_NAME.length + 1)) : null;
}

export function isAuthenticated(req) {
  return verifySessionToken(readSession(req));
}

export function sessionCookie(token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${MAX_AGE_SECONDS}${secure}`;
}

export function expiredCookie() {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

export function checkPassword(candidate) {
  if (!PASSWORD || typeof candidate !== "string") return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(PASSWORD);
  return a.length === b.length && timingSafeEqual(a, b);
}
