import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

const STATUSES = ["pending", "contacted", "confirmed", "cancelled"];

function formatDate(value) {
  if (!value) return "Not provided";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCreated(value) {
  if (!value) return "Not provided";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function programLabel(program) {
  if (program === "dta") return "DTA · Adults";
  if (program === "dtt") return "DTT · Kids";
  return "Not sure";
}

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [meta, setMeta] = useState({ storage: "", emailConfigured: false });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [notice, setNotice] = useState("");

  async function loadBookings() {
    setLoading(true);
    setListError("");
    try {
      const response = await fetch("/api/bookings", { credentials: "same-origin" });
      const data = await response.json();
      if (response.status === 401) {
        setAuthed(false);
        return;
      }
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not load bookings.");
      setBookings(data.bookings || []);
      setStats(data.stats || null);
      setMeta({ storage: data.storage || "", emailConfigured: Boolean(data.emailConfigured) });
    } catch (error) {
      setListError(String(error.message || error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/admin/me", { credentials: "same-origin" });
        const data = await response.json();
        if (cancelled) return;
        setAuthed(Boolean(data.authenticated));
        setConfigured(data.configured !== false);
        if (data.authenticated) await loadBookings();
      } catch {
        if (!cancelled) setListError("Could not reach the admin service.");
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(event) {
    event.preventDefault();
    setLoggingIn(true);
    setLoginError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Sign in failed.");
      setAuthed(true);
      setPassword("");
      await loadBookings();
    } catch (error) {
      setLoginError(String(error.message || error));
    } finally {
      setLoggingIn(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    setAuthed(false);
    setBookings([]);
    setStats(null);
  }

  async function changeStatus(id, status) {
    const response = await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      setNotice("Status updated.");
      await loadBookings();
    } else {
      setNotice("Could not update status.");
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this booking permanently?")) return;
    const response = await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    if (response.ok) {
      setNotice("Booking deleted.");
      setExpanded(null);
      await loadBookings();
    } else {
      setNotice("Could not delete booking.");
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (!q) return true;
      return [b.name, b.email, b.phone, b.city, b.id, b.notes]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [bookings, search, statusFilter]);

  if (checking) {
    return (
      <main id="main" className="admin-page">
        <div className="admin-shell wrap">
          <p className="admin-muted">Checking access…</p>
        </div>
      </main>
    );
  }

  if (!authed) {
    return (
      <main id="main" className="admin-page">
        <div className="admin-shell wrap">
          <div className="admin-login">
            <span className="admin-badge">
              <ShieldCheck size={26} />
            </span>
            <p className="section-label">Restricted area</p>
            <h1>
              Admin <em>sign in.</em>
            </h1>
            <p className="admin-muted">
              This area shows consultation requests submitted through the website.
            </p>
            {!configured && (
              <p className="form-status error" role="alert">
                Admin login is not configured. Set <code>ADMIN_PASSWORD</code> in the
                deployment environment.
              </p>
            )}
            <form onSubmit={login}>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              {loginError && (
                <p className="form-status error" role="alert">
                  {loginError}
                </p>
              )}
              <button className="button button-dark" type="submit" disabled={loggingIn || !configured}>
                {loggingIn ? "Signing in…" : "Sign in"} <Check size={17} />
              </button>
            </form>
            <Link className="arrow-link" to="/">
              <ArrowLeft size={16} /> Back to website
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="admin-page">
      <div className="admin-shell wrap">
        <header className="admin-header">
          <div>
            <p className="section-label">Arizona Development Center</p>
            <h1>
              Bookings <em>dashboard.</em>
            </h1>
            <p className="admin-muted">
              Storage: <strong>{meta.storage || "Not configured"}</strong> · Email:{" "}
              <strong>{meta.emailConfigured ? "configured" : "not configured"}</strong>
            </p>
          </div>
          <div className="admin-header-actions">
            <button className="button button-ghost" type="button" onClick={loadBookings}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button className="button button-ghost" type="button" onClick={logout}>
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </header>

        {stats && (
          <section className="stat-grid" aria-label="Booking summary">
            {[
              ["Total", stats.total],
              ["Pending", stats.pending],
              ["Contacted", stats.contacted],
              ["Confirmed", stats.confirmed],
              ["Cancelled", stats.cancelled],
            ].map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </section>
        )}

        {notice && (
          <p className="form-status admin-notice" role="status">
            {notice}
          </p>
        )}
        {listError && (
          <p className="form-status error" role="alert">
            {listError}
          </p>
        )}

        <section className="admin-toolbar">
          <label className="admin-search">
            <Search size={17} />
            <span className="sr-only">Search bookings</span>
            <input
              type="search"
              placeholder="Search name, email, city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <label className="admin-filter">
            <span className="sr-only">Filter by status</span>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <span className="admin-count">
            {filtered.length} of {bookings.length}
          </span>
        </section>

        {loading ? (
          <p className="admin-muted">Loading bookings…</p>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">
            <h2>No bookings yet</h2>
            <p>New consultation requests will appear here as soon as they are submitted.</p>
          </div>
        ) : (
          <div className="booking-table" role="table" aria-label="Consultation requests">
            <div className="booking-table-head" role="row">
              <span role="columnheader">Member</span>
              <span role="columnheader">Program</span>
              <span role="columnheader">Preferred</span>
              <span role="columnheader">Submitted</span>
              <span role="columnheader">Status</span>
            </div>
            {filtered.map((b) => (
              <article key={b.id} className="booking-row-wrap" role="presentation">
                <div className="booking-row" role="row">
                  <div className="cell-primary" role="cell">
                    <strong>{b.name}</strong>
                    <small>{b.email}</small>
                  </div>
                  <div role="cell" data-label="Program">
                    {programLabel(b.program)}
                  </div>
                  <div role="cell" data-label="Preferred">
                    {formatDate(b.preferredDate)}
                    <small>{b.preferredTime || "No preference"}</small>
                  </div>
                  <div role="cell" data-label="Submitted">
                    {formatCreated(b.createdAt)}
                  </div>
                  <div role="cell" data-label="Status">
                    <select
                      className={`status-pill status-${b.status}`}
                      value={b.status}
                      onChange={(e) => changeStatus(b.id, e.target.value)}
                      aria-label={`Status for ${b.name}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s[0].toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div role="cell" className="row-expand-cell">
                    <button
                      className="row-expand"
                      type="button"
                      onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                      aria-expanded={expanded === b.id}
                    >
                      {expanded === b.id ? <X size={16} /> : "Details"}
                    </button>
                  </div>
                </div>
                {expanded === b.id && (
                  <div className="booking-detail">
                    <dl>
                      <div>
                        <dt>Reference</dt>
                        <dd>ADC-{b.id.slice(0, 8).toUpperCase()}</dd>
                      </div>
                      <div>
                        <dt>Phone</dt>
                        <dd>{b.phone || "Not provided"}</dd>
                      </div>
                      <div>
                        <dt>Location</dt>
                        <dd>
                          {b.city} {b.zip}
                        </dd>
                      </div>
                      <div>
                        <dt>Participant</dt>
                        <dd>
                          {b.participantName || "Not provided"} ({b.participantAge || "age not stated"})
                        </dd>
                      </div>
                      <div>
                        <dt>Contact method</dt>
                        <dd>{b.contactMethod}</dd>
                      </div>
                      <div>
                        <dt>Accessibility</dt>
                        <dd>{b.accessibilityNeeds ? "Yes" : "No"}</dd>
                      </div>
                      <div>
                        <dt>Transportation</dt>
                        <dd>{b.transportationNeeds ? "Yes" : "No"}</dd>
                      </div>
                      <div>
                        <dt>Email sent</dt>
                        <dd>{b.confirmationSent ? "Yes" : "No"}</dd>
                      </div>
                    </dl>
                    {b.notes && (
                      <p className="detail-notes">
                        <strong>Notes:</strong> {b.notes}
                      </p>
                    )}
                    <button className="link-danger" type="button" onClick={() => remove(b.id)}>
                      Delete this booking
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
