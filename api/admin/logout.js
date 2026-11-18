import { json, requireMethod } from "../../server/http.js";
import { expiredCookie } from "../../server/auth.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["POST"])) return;
  return json(res, 200, { ok: true }, { "Set-Cookie": expiredCookie() });
}
