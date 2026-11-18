// Email notifications via the Resend REST API. Deliberately a no-op until the
// business supplies credentials, so bookings still save and show in admin.
const API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.BOOKING_TO_EMAIL || process.env.VITE_CONTACT_EMAIL;
const FROM_EMAIL =
  process.env.BOOKING_FROM_EMAIL || "Arizona Development Center <onboarding@resend.dev>";

export const emailConfigured = Boolean(API_KEY && TO_EMAIL);

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function send({ to, subject, html, replyTo }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend ${response.status}: ${text}`);
  }
  return response.json();
}

export async function sendBookingEmails(booking) {
  if (!emailConfigured) {
    return {
      sent: false,
      skipped: true,
      reason: "Email not configured (set RESEND_API_KEY and BOOKING_TO_EMAIL).",
    };
  }

  const date = booking.preferredDate
    ? new Date(`${booking.preferredDate}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "No specific date";

  const result = { sent: false, confirmation: null, notification: null };

  try {
    result.confirmation = await send({
      to: booking.email,
      replyTo: TO_EMAIL,
      subject: `We received your consultation request — ${booking.reference || booking.id}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#202a25">
        <h2>Thank you, ${escapeHtml(booking.name)}.</h2>
        <p>We received your request for a free consultation with Arizona Development Center. The care team will follow up to discuss availability. <strong>This is a request, not a confirmed appointment.</strong></p>
        <p><strong>Reference:</strong> ${escapeHtml(booking.reference || booking.id)}<br>
        <strong>Program:</strong> ${escapeHtml(booking.program)}<br>
        <strong>Preferred date:</strong> ${escapeHtml(date)}<br>
        <strong>Preferred time:</strong> ${escapeHtml(booking.preferredTime || "No preference")}</p>
        <p>Please do not send diagnoses, medications, or other sensitive health information by email.</p>
        <p>11001 N 99th Ave, Peoria, AZ 85345</p>
      </div>`,
    });
    result.sent = true;
  } catch (error) {
    result.confirmationError = String(error.message || error);
  }

  try {
    result.notification = await send({
      to: TO_EMAIL,
      replyTo: booking.email,
      subject: `New booking: ${escapeHtml(booking.name)} (${booking.reference || booking.id})`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#202a25">
        <h2>New consultation request</h2>
        <p><strong>Reference:</strong> ${escapeHtml(booking.reference || booking.id)}<br>
        <strong>Name:</strong> ${escapeHtml(booking.name)}<br>
        <strong>Email:</strong> ${escapeHtml(booking.email)}<br>
        <strong>Phone:</strong> ${escapeHtml(booking.phone || "Not provided")}<br>
        <strong>City / ZIP:</strong> ${escapeHtml(booking.city)} ${escapeHtml(booking.zip)}<br>
        <strong>Program:</strong> ${escapeHtml(booking.program)}<br>
        <strong>Participant:</strong> ${escapeHtml(booking.participantName || "Not provided")} (${escapeHtml(booking.participantAge || "age not stated")})<br>
        <strong>Preferred date:</strong> ${escapeHtml(date)}<br>
        <strong>Preferred time:</strong> ${escapeHtml(booking.preferredTime || "No preference")}<br>
        <strong>Contact method:</strong> ${escapeHtml(booking.contactMethod)}<br>
        <strong>Accessibility needs:</strong> ${booking.accessibilityNeeds ? "Yes" : "No"}<br>
        <strong>Transportation question:</strong> ${booking.transportationNeeds ? "Yes" : "No"}<br>
        <strong>Notes:</strong> ${escapeHtml(booking.notes || "None")}</p>
        <p>View and manage it in the admin dashboard at <a href="/admin">/admin</a>.</p>
      </div>`,
    });
  } catch (error) {
    result.notificationError = String(error.message || error);
  }

  return result;
}
