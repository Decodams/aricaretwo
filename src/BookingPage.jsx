import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import ContactDetails from "./ContactDetails.jsx";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STEPS = ["Program & timing", "About you", "Support needs", "Review"];

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function SectionLabel({ children }) {
  return (
    <div className="section-label">
      <span className="label-rule" />
      {children}
    </div>
  );
}

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <span className="field-error" id={id} role="alert">
      {children}
    </span>
  );
}

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const [form, setForm] = useState({
    program: "",
    preferredDate: "",
    preferredTime: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    zip: "",
    participantName: "",
    participantAge: "",
    contactMethod: "email",
    accessibilityNeeds: false,
    transportationNeeds: false,
    notes: "",
    consent: false,
    website: "",
  });

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  function validateStep(index) {
    const e = {};
    if (index === 0) {
      if (!form.program) e.program = "Choose the program you are asking about.";
      if (form.preferredDate) {
        const d = new Date(`${form.preferredDate}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (d < today) e.preferredDate = "Choose today or a later date.";
        else if (d.getDay() === 0 || d.getDay() === 6)
          e.preferredDate = "We schedule weekdays. Choose Monday–Friday.";
      }
    }
    if (index === 1) {
      if (form.name.trim().length < 2) e.name = "Please enter your name.";
      if (!EMAIL.test(form.email.trim())) e.email = "Enter a valid email address.";
      if (!form.city.trim()) e.city = "Enter your city or ZIP code.";
      if (!form.participantAge) e.participantAge = "Choose an age range.";
      if (form.contactMethod === "phone" && !form.phone.trim())
        e.phone = "A phone number is needed if you prefer a call.";
    }
    if (index === 3 && !form.consent)
      e.consent = "Please agree to be contacted before submitting.";

    const phi = /\b\d{3}-\d{2}-\d{4}\b|\bmedication(s)?\b|\bdiagnos(is|es)\b/i;
    if (phi.test(form.notes))
      e.notes = "Please leave diagnoses, medications, and ID numbers out of this form.";

    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      requestAnimationFrame(() => {
        const el = formRef.current?.querySelector(`[name="${first}"]`);
        el?.focus();
      });
    }
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function back() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit(event) {
    event.preventDefault();
    if (!validateStep(3)) return;

    const params = new URLSearchParams(window.location.search);
    const payload = {
      ...form,
      program: form.program || "unsure",
      utmSource: params.get("utm_source") || "",
      utmMedium: params.get("utm_medium") || "",
      utmCampaign: params.get("utm_campaign") || "",
    };

    setSending(true);
    setServerError("");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        if (data.errors) {
          setErrors(data.errors);
          setServerError(data.message || "Please check the highlighted fields.");
        } else {
          setServerError(data.error || "Something went wrong. Please try again.");
        }
        return;
      }
      setReference(data.reference || "Pending");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setServerError(
        "We could not reach the booking service. Please check your connection and try again.",
      );
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <main id="main" className="booking-page">
        <section className="booking-shell wrap">
          <div className="booking-success" role="status">
            <span className="success-icon">
              <Check size={34} />
            </span>
            <SectionLabel>Request received</SectionLabel>
            <h1>
              Thank you, {form.name.split(" ")[0]}.
              <br />
              <em>We’ll be in touch.</em>
            </h1>
            <p>
              Your consultation request is saved. The care team will follow up to
              discuss availability. <strong>This is a request, not a confirmed
              appointment.</strong>
            </p>
            <div className="reference-box">
              <span>Your reference</span>
              <strong>{reference}</strong>
            </div>
            <p className="small-print">
              Please do not send diagnoses, medications, or other sensitive
              health information by email.
            </p>
            <div className="booking-success-actions">
              <Link className="button button-primary" to="/">
                Back to home <ArrowRight size={17} />
              </Link>
              <Link className="arrow-link" to="/faqs">
                Read the FAQs
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main" className="booking-page">
      <section className="booking-shell wrap">
        <div className="booking-intro">
          <SectionLabel>Free consultation</SectionLabel>
          <h1>
            Book a time to
            <br />
            <em>talk with us.</em>
          </h1>
          <p>
            A short conversation to learn what you are looking for and answer
            your questions. You do not need to have everything figured out.
          </p>
          <div className="booking-assurances">
            <p>
              <ShieldCheck size={18} /> No sensitive health details needed
            </p>
            <p>
              <HeartHandshake size={18} /> Family questions welcome
            </p>
            <p>
              <CalendarDays size={18} /> We reply on weekdays
            </p>
          </div>
          <ContactDetails compact />
        </div>

        <div className="booking-card">
          <ol className="stepper" aria-label="Booking progress">
            {STEPS.map((label, index) => (
              <li
                key={label}
                className={index === step ? "current" : index < step ? "done" : ""}
                aria-current={index === step ? "step" : undefined}
              >
                <span>{index < step ? <Check size={14} /> : index + 1}</span>
                <small>{label}</small>
              </li>
            ))}
          </ol>

          <form ref={formRef} onSubmit={submit} noValidate>
            <div className="honeypot-field" aria-hidden="true">
              <label>
                Leave this empty
                <input
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                />
              </label>
            </div>

            {step === 0 && (
              <fieldset className="form-step">
                <legend>Which program are you asking about?</legend>
                <div className="choice-grid">
                  {[
                    ["dta", "Adult program (DTA)", "Day Treatment and Training for adults"],
                    ["dtt", "Kids & youth (DTT)", "Day Treatment and Training for children"],
                    ["unsure", "Not sure yet", "We’ll help you figure it out together"],
                  ].map(([value, title, hint]) => (
                    <label
                      key={value}
                      className={`choice${form.program === value ? " selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="program"
                        value={value}
                        checked={form.program === value}
                        onChange={(e) => set("program", e.target.value)}
                      />
                      <strong>{title}</strong>
                      <small>{hint}</small>
                    </label>
                  ))}
                </div>
                <FieldError id="program-error">{errors.program}</FieldError>

                <div className="form-row">
                  <label>
                    Preferred date <small>Optional</small>
                    <input
                      name="preferredDate"
                      type="date"
                      min={todayISO()}
                      value={form.preferredDate}
                      onChange={(e) => set("preferredDate", e.target.value)}
                      aria-invalid={Boolean(errors.preferredDate)}
                      aria-describedby={errors.preferredDate ? "preferredDate-error" : undefined}
                    />
                    <FieldError id="preferredDate-error">{errors.preferredDate}</FieldError>
                  </label>
                  <label>
                    Preferred time <small>Optional</small>
                    <select
                      name="preferredTime"
                      value={form.preferredTime}
                      onChange={(e) => set("preferredTime", e.target.value)}
                    >
                      <option value="">No preference</option>
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="early-evening">Early evening</option>
                    </select>
                  </label>
                </div>
                <p className="smart-hint">
                  {form.program === "dtt"
                    ? "For DTT, tell us your child’s age in the next step so we can route your request."
                    : form.program === "dta"
                      ? "For DTA, we’ll ask about the adult participant in the next step."
                      : "No problem. We can talk through both programs."}
                </p>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset className="form-step">
                <legend>How can we reach you?</legend>
                <label>
                  Your name <span>*</span>
                  <input
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                  />
                  <FieldError>{errors.name}</FieldError>
                </label>
                <div className="form-row">
                  <label>
                    Email address <span>*</span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      aria-invalid={Boolean(errors.email)}
                    />
                    <FieldError>{errors.email}</FieldError>
                  </label>
                  <label>
                    Phone number <small>{form.contactMethod === "phone" ? "*" : "Optional"}</small>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      aria-invalid={Boolean(errors.phone)}
                    />
                    <FieldError>{errors.phone}</FieldError>
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    City or ZIP code <span>*</span>
                    <input
                      name="city"
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      aria-invalid={Boolean(errors.city)}
                    />
                    <FieldError>{errors.city}</FieldError>
                  </label>
                  <label>
                    Participant’s first name <small>Optional</small>
                    <input
                      name="participantName"
                      value={form.participantName}
                      onChange={(e) => set("participantName", e.target.value)}
                    />
                  </label>
                </div>
                <label>
                  Participant age range <span>*</span>
                  <select
                    name="participantAge"
                    value={form.participantAge}
                    onChange={(e) => set("participantAge", e.target.value)}
                    aria-invalid={Boolean(errors.participantAge)}
                  >
                    <option value="">Choose one</option>
                    <option value="under-18">Under 18 (DTT)</option>
                    <option value="18-or-over">18 or over (DTA)</option>
                  </select>
                  <FieldError>{errors.participantAge}</FieldError>
                </label>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset className="form-step">
                <legend>A little more detail</legend>
                <label>
                  How should we contact you? <span>*</span>
                  <select
                    name="contactMethod"
                    value={form.contactMethod}
                    onChange={(e) => set("contactMethod", e.target.value)}
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone call</option>
                  </select>
                </label>
                <div className="check-grid">
                  <label className="check-card">
                    <input
                      type="checkbox"
                      name="accessibilityNeeds"
                      checked={form.accessibilityNeeds}
                      onChange={(e) => set("accessibilityNeeds", e.target.checked)}
                    />
                    <span>
                      <strong>Accessibility question</strong>
                      <small>I’d like to discuss accessibility (e.g. wheelchair access).</small>
                    </span>
                  </label>
                  <label className="check-card">
                    <input
                      type="checkbox"
                      name="transportationNeeds"
                      checked={form.transportationNeeds}
                      onChange={(e) => set("transportationNeeds", e.target.checked)}
                    />
                    <span>
                      <strong>Transportation question</strong>
                      <small>I’d like to ask about pickup or an accessible vehicle.</small>
                    </span>
                  </label>
                </div>
                <label>
                  Anything else you’d like us to know? <small>Optional</small>
                  <textarea
                    name="notes"
                    rows="4"
                    maxLength="600"
                    placeholder="General questions or preferences only."
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    aria-invalid={Boolean(errors.notes)}
                  />
                  <FieldError>{errors.notes}</FieldError>
                </label>
                <p className="privacy-callout">
                  <ShieldCheck size={17} /> Please do not include diagnoses,
                  medications, or other sensitive health information.
                </p>
              </fieldset>
            )}

            {step === 3 && (
              <fieldset className="form-step">
                <legend>Review your request</legend>
                <dl className="review-list">
                  <div>
                    <dt>Program</dt>
                    <dd>
                      {form.program === "dta"
                        ? "Adult program (DTA)"
                        : form.program === "dtt"
                          ? "Kids & youth (DTT)"
                          : "Not sure yet"}
                    </dd>
                  </div>
                  <div>
                    <dt>Preferred day / time</dt>
                    <dd>
                      {form.preferredDate || "No specific day"} ·{" "}
                      {form.preferredTime || "No preference"}
                    </dd>
                  </div>
                  <div>
                    <dt>Contact</dt>
                    <dd>
                      {form.name} · {form.email}
                      {form.phone ? ` · ${form.phone}` : ""}
                    </dd>
                  </div>
                  <div>
                    <dt>Location</dt>
                    <dd>{form.city}</dd>
                  </div>
                  <div>
                    <dt>Contact method</dt>
                    <dd>{form.contactMethod === "phone" ? "Phone call" : "Email"}</dd>
                  </div>
                </dl>
                <label className="consent-label">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={form.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    aria-invalid={Boolean(errors.consent)}
                  />
                  <span>
                    I agree that Arizona Development Center may contact me about
                    this request. <strong>*</strong>
                  </span>
                </label>
                <FieldError>{errors.consent}</FieldError>
                <p className="small-print">
                  This is a request, not a confirmed appointment. The care team
                  will follow up to discuss availability.
                </p>
              </fieldset>
            )}

            {serverError && (
              <p className="form-status error" role="alert">
                {serverError}
              </p>
            )}

            <div className="booking-actions">
              {step > 0 && (
                <button type="button" className="button button-ghost" onClick={back}>
                  <ArrowLeft size={17} /> Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button type="button" className="button button-primary" onClick={next}>
                  Continue <ArrowRight size={17} />
                </button>
              ) : (
                <button className="button button-primary" type="submit" disabled={sending}>
                  {sending ? "Sending…" : "Send request"} <ArrowRight size={17} />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
