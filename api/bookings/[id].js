import { json, readBody, requireMethod } from "../../server/http.js";
import {
  getBooking,
  updateBooking,
  deleteBooking,
} from "../../server/store.js";
import { isAuthenticated } from "../../server/auth.js";

const STATUSES = new Set(["pending", "contacted", "confirmed", "cancelled"]);

export default async function handler(req, res) {
  if (!isAuthenticated(req)) {
    return json(res, 401, { ok: false, error: "Sign in to manage bookings." });
  }
  if (!requireMethod(req, res, ["GET", "PATCH", "DELETE"])) return;

  const id = req.query?.id || req.url?.split("?")[0].split("/").filter(Boolean).pop();
  if (!id) return json(res, 400, { ok: false, error: "Missing booking id." });

  if (req.method === "GET") {
    const booking = await getBooking(id);
    return booking
      ? json(res, 200, { ok: true, booking })
      : json(res, 404, { ok: false, error: "Booking not found." });
  }

  if (req.method === "DELETE") {
    const removed = await deleteBooking(id);
    return json(res, removed ? 200 : 404, {
      ok: removed,
      message: removed ? "Booking deleted." : "Booking not found.",
    });
  }

  const body = await readBody(req);
  if (body.status && !STATUSES.has(body.status)) {
    return json(res, 422, { ok: false, error: "Invalid status." });
  }
  const patch = { status: body.status, notes: body.notes };
  for (const key of Object.keys(patch)) {
    if (patch[key] === undefined) delete patch[key];
  }
  const updated = await updateBooking(id, patch);
  return updated
    ? json(res, 200, { ok: true, booking: updated })
    : json(res, 404, { ok: false, error: "Booking not found." });
}
