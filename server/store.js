// Booking storage. Uses Supabase REST when configured, otherwise a local JSON
// file so the whole flow can be exercised locally before credentials exist.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const TABLE = process.env.SUPABASE_BOOKINGS_TABLE || "bookings";
const DATA_DIR = path.resolve(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

export const storageMode = SUPABASE_URL && SUPABASE_KEY ? "supabase" : "file";

function toRow(b) {
  return {
    id: b.id,
    created_at: b.createdAt,
    status: b.status,
    program: b.program,
    name: b.name,
    email: b.email,
    phone: b.phone || "",
    city: b.city,
    zip: b.zip || "",
    participant_name: b.participantName || "",
    participant_age: b.participantAge || "",
    contact_method: b.contactMethod || "email",
    preferred_date: b.preferredDate || "",
    preferred_time: b.preferredTime || "",
    accessibility_needs: Boolean(b.accessibilityNeeds),
    transportation_needs: Boolean(b.transportationNeeds),
    notes: b.notes || "",
    consent: Boolean(b.consent),
    source: b.source || "website",
    utm_source: b.utmSource || "",
    utm_medium: b.utmMedium || "",
    utm_campaign: b.utmCampaign || "",
    confirmation_sent: Boolean(b.confirmationSent),
  };
}

function fromRow(r) {
  return {
    id: r.id,
    createdAt: r.created_at,
    status: r.status,
    program: r.program,
    name: r.name,
    email: r.email,
    phone: r.phone || "",
    city: r.city,
    zip: r.zip || "",
    participantName: r.participant_name || "",
    participantAge: r.participant_age || "",
    contactMethod: r.contact_method || "email",
    preferredDate: r.preferred_date || "",
    preferredTime: r.preferred_time || "",
    accessibilityNeeds: Boolean(r.accessibility_needs),
    transportationNeeds: Boolean(r.transportation_needs),
    notes: r.notes || "",
    consent: Boolean(r.consent),
    source: r.source || "website",
    utmSource: r.utm_source || "",
    utmMedium: r.utm_medium || "",
    utmCampaign: r.utm_campaign || "",
    confirmationSent: Boolean(r.confirmation_sent),
  };
}

async function sbFetch(resource, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${resource}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let data = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* keep raw text for error reporting */
  }
  if (!response.ok) {
    throw new Error(
      `Supabase ${response.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`,
    );
  }
  return data;
}

async function readFileStore() {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeFileStore(rows) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(rows, null, 2), "utf8");
}

export async function createBooking(input) {
  const record = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "pending",
    ...input,
    source: input.source || "website",
  };

  if (storageMode === "supabase") {
    const [row] = await sbFetch(TABLE, {
      method: "POST",
      body: JSON.stringify(toRow(record)),
    });
    return fromRow(row || toRow(record));
  }

  const rows = await readFileStore();
  rows.push(toRow(record));
  await writeFileStore(rows);
  return fromRow(toRow(record));
}

export async function listBookings() {
  if (storageMode === "supabase") {
    const rows = await sbFetch(`${TABLE}?select=*&order=created_at.desc`, {
      method: "GET",
    });
    return (rows || []).map(fromRow);
  }
  const rows = await readFileStore();
  return rows
    .map(fromRow)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getBooking(id) {
  if (storageMode === "supabase") {
    const rows = await sbFetch(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: "GET",
    });
    return rows?.[0] ? fromRow(rows[0]) : null;
  }
  const rows = await readFileStore();
  const found = rows.find((r) => r.id === id);
  return found ? fromRow(found) : null;
}

export async function updateBooking(id, patch) {
  const allowed = [
    "status",
    "notes",
    "confirmation_sent",
    "name",
    "email",
    "phone",
    "preferred_date",
    "preferred_time",
  ];
  const clean = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(patch, key)) clean[key] = patch[key];
  }
  if (!Object.keys(clean).length) return getBooking(id);

  if (storageMode === "supabase") {
    const rows = await sbFetch(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(clean),
    });
    return rows?.[0] ? fromRow(rows[0]) : getBooking(id);
  }
  const rows = await readFileStore();
  const index = rows.findIndex((r) => r.id === id);
  if (index === -1) return null;
  rows[index] = { ...rows[index], ...clean };
  await writeFileStore(rows);
  return fromRow(rows[index]);
}

export async function deleteBooking(id) {
  if (storageMode === "supabase") {
    await sbFetch(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return true;
  }
  const rows = await readFileStore();
  const next = rows.filter((r) => r.id !== id);
  await writeFileStore(next);
  return next.length !== rows.length;
}
