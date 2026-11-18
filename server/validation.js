const PROGRAMS = new Set(["dta", "dtt", "unsure"]);
const TIMES = new Set(["morning", "afternoon", "early-evening", ""]);
const METHODS = new Set(["email", "phone"]);
const AGES = new Set(["under-18", "18-or-over", ""]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clean = (value, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export function validateBooking(input = {}) {
  const errors = {};
  const booking = {
    name: clean(input.name, 100),
    email: clean(input.email, 254).toLowerCase(),
    phone: clean(input.phone, 40),
    city: clean(input.city, 80),
    zip: clean(input.zip, 20),
    program: clean(input.program, 20),
    participantName: clean(input.participantName, 100),
    participantAge: clean(input.participantAge, 20),
    contactMethod: clean(input.contactMethod, 20) || "email",
    preferredDate: clean(input.preferredDate, 10),
    preferredTime: clean(input.preferredTime, 20),
    accessibilityNeeds: Boolean(input.accessibilityNeeds),
    transportationNeeds: Boolean(input.transportationNeeds),
    notes: clean(input.notes, 600),
    consent: Boolean(input.consent),
    utmSource: clean(input.utmSource, 100),
    utmMedium: clean(input.utmMedium, 100),
    utmCampaign: clean(input.utmCampaign, 100),
  };

  if (booking.name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL.test(booking.email)) errors.email = "Please enter a valid email address.";
  if (!booking.city) errors.city = "Please enter your city or ZIP code.";
  if (!PROGRAMS.has(booking.program)) errors.program = "Please choose a program.";
  if (!METHODS.has(booking.contactMethod)) errors.contactMethod = "Choose a contact method.";
  if (!AGES.has(booking.participantAge)) errors.participantAge = "Choose an age range.";
  if (!TIMES.has(booking.preferredTime)) errors.preferredTime = "Choose a preferred time.";
  if (!booking.consent) errors.consent = "Please agree to be contacted before submitting.";

  if (booking.preferredDate) {
    const parsed = new Date(`${booking.preferredDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(parsed.getTime()) || parsed < today) {
      errors.preferredDate = "Choose today or a future date.";
    } else if (parsed.getDay() === 0 || parsed.getDay() === 6) {
      errors.preferredDate = "We book weekdays. Choose Monday–Friday.";
    }
  }

  // Reject obvious PHI in the free-text note (the UI repeats this warning).
  const phi = /\b\d{3}-\d{2}-\d{4}\b|\bmedication(s)?\b|\bdiagnos(is|es)\b/i;
  if (phi.test(booking.notes)) {
    errors.notes =
      "Please leave diagnoses, medications, and government ID numbers out of this form.";
  }

  return { booking, errors, valid: Object.keys(errors).length === 0 };
}
