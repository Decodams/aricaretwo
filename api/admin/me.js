import { json, requireMethod } from "../../server/http.js";
import { isAuthenticated, adminConfigured } from "../../server/auth.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET"])) return;
  return json(res, 200, {
    ok: true,
    authenticated: isAuthenticated(req),
    configured: adminConfigured,
  });
}
