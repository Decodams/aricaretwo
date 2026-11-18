import { json, readBody, requireMethod } from "../../server/http.js";
import {
  checkPassword,
  createSessionToken,
  sessionCookie,
  expiredCookie,
  adminConfigured,
} from "../../server/auth.js";
import { rateLimited } from "../../server/http.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) return;

  if (req.method === "POST") {
    const ip =
      req.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.headers?.["x-real-ip"] ||
      "local";
    if (rateLimited(`login:${ip}`, 8, 15 * 60 * 1000)) {
      return json(res, 429, { ok: false, error: "Too many attempts. Try again later." });
    }

    const body = await readBody(req);
    if (!adminConfigured) {
      return json(res, 503, {
        ok: false,
        error: "Admin login is not configured. Set ADMIN_PASSWORD in the deployment environment.",
      });
    }
    if (!checkPassword(body.password)) {
      return json(res, 401, { ok: false, error: "Incorrect password." });
    }
    return json(res, 200, { ok: true }, { "Set-Cookie": sessionCookie(createSessionToken()) });
  }

  return json(res, 200, { ok: true }, { "Set-Cookie": expiredCookie() });
}
