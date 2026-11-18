import {
  json,
  readBody,
  requireMethod,
  statsFrom,
  rateLimited,
} from "../../server/http.js";
import { createBooking, listBookings, storageMode } from "../../server/store.js";
import { validateBooking } from "../../server/validation.js";
import { isAuthenticated } from "../../server/auth.js";
import { sendBookingEmails, emailConfigured } from "../../server/email.js";

export default async function handler(req, res) {
  if (!requireMethod(req, res, ["GET", "POST"])) return;

  if (req.method === "GET") {
    if (!isAuthenticated(req)) {
      return json(res, 401, { ok: false, error: "Sign in to view bookings." });
    }
    try {
      const bookings = await listBookings();
      return json(res, 200, {
        ok: true,
        bookings,
        stats: statsFrom(bookings),
        storage: storageMode,
        emailConfigured,
      });
    } catch (error) {
      console.error("List bookings failed:", error);
      return json(res, 500, { ok: false, error: "Could not load bookings." });
    }
  }

  // POST — public booking submission
  const ip =
    req.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers?.["x-real-ip"] ||
    "local";
  if (rateLimited(ip)) {
    return json(res, 429, {
      ok: false,
      error: "Too many requests. Please try again in a few minutes.",
    });
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return json(res, 400, { ok: false, error: "Invalid request." });
  }

  // Honeypot: silently accept but do not store.
  if (body.website) {
    return json(res, 201, { ok: true, reference: "—", message: "Thank you." });
  }

  const { booking, errors, valid } = validateBooking(body);
  if (!valid) {
    return json(res, 422, { ok: false, errors, message: "Please check the highlighted fields." });
  }

  try {
    const saved = await createBooking(booking);
    const reference = `ADC-${saved.id.slice(0, 8).toUpperCase()}`;
    let emailResult = { sent: false, skipped: true };
    try {
      emailResult = await sendBookingEmails({ ...saved, reference });
    } catch (error) {
      console.error("Email delivery failed:", error);
      emailResult = { sent: false, error: "Email delivery failed." };
    }

    return json(res, 201, {
      ok: true,
      reference,
      id: saved.id,
      message:
        "Your request was received. The care team will follow up; this is not a confirmed appointment.",
      email: emailResult,
    });
  } catch (error) {
    console.error("Create booking failed:", error);
    return json(res, 500, {
      ok: false,
      error: "We could not save your request right now. Please try again.",
    });
  }
}
