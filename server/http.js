export function json(res, status, data, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  for (const [key, value] of Object.entries(extraHeaders)) {
    res.setHeader(key, value);
  }
  res.end(JSON.stringify(data));
}

export async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function requireMethod(req, res, methods) {
  if (methods.includes(req.method)) return true;
  res.setHeader("Allow", methods.join(", "));
  json(res, 405, { ok: false, error: "Method not allowed." });
  return false;
}

export function statsFrom(bookings) {
  const byStatus = {};
  for (const b of bookings) byStatus[b.status] = (byStatus[b.status] || 0) + 1;
  return {
    total: bookings.length,
    pending: byStatus.pending || 0,
    confirmed: byStatus.confirmed || 0,
    contacted: byStatus.contacted || 0,
    cancelled: byStatus.cancelled || 0,
  };
}

// Tiny in-memory rate limiter. Resets on cold start, which is acceptable for
// basic abuse deterrence; a managed store can replace it later.
const hits = new Map();
export function rateLimited(key, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const entry = hits.get(key) || { count: 0, reset: now + windowMs };
  if (entry.reset < now) {
    entry.count = 0;
    entry.reset = now + windowMs;
  }
  entry.count += 1;
  hits.set(key, entry);
  if (hits.size > 5000) hits.clear();
  return entry.count > limit;
}
