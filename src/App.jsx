import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import BookingPage from "./BookingPage.jsx";
import AdminPage from "./AdminPage.jsx";
import ContactDetails from "./ContactDetails.jsx";
import { siteConfig, addressLine, telHref } from "../config/site.ts";
import { images } from "../data/images.ts";
import { services, getService } from "../data/services.ts";
import { testimonials } from "../data/testimonials.ts";
import { staff } from "../data/staff.ts";
import { faqs } from "../data/faqs.ts";
import { jsonLdForPath, metaForPath } from "./seo.js";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  HeartHandshake,
  Menu,
  MapPin,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";

const brandName = siteConfig.brandName;
const dtaService = getService("dta");
const dttService = getService("dtt");

const primaryNavigation = [
  ["Programs", "/services"],
  ["How it works", "/how-it-works"],
  ["About", "/about"],
  ["FAQs", "/faqs"],
];

const processSteps = [
  [
    "01",
    "Start with a conversation",
    "Tell us what you are looking for. We will listen, answer questions, and talk through program fit and the next step.",
  ],
  [
    "02",
    "A plan shaped around the person",
    "If the program may be a fit, discuss an individualized support plan shaped around the person’s strengths, preferences, support needs, and goals.",
  ],
  [
    "03",
    "Steady support and clear updates",
    "Build skills and community participation through a consistent day, with communication about progress and changing needs.",
  ],
];

const dtaSchedule = [
  [
    "8:00 to 9:00 AM",
    "Arrival and check-in",
    "Members arrive with their lunch and snacks. Food is labeled and stored safely.",
  ],
  [
    "9:00 to 10:00 AM",
    "Morning group",
    "Greeting, the daily plan, and social-skills activities.",
  ],
  [
    "10:00 to 11:00 AM",
    "Teamwork and life skills",
    "Practice everyday tasks, hygiene, and simple shared responsibilities.",
  ],
  [
    "11:00 AM to 12:00 PM",
    "Learning activities",
    "Reading, writing, or other basic learning activities.",
  ],
  [
    "12:00 to 12:30 PM",
    "Lunch",
    "Members eat the meals they brought. Staff provide supervision and support.",
  ],
  [
    "12:30 to 1:30 PM",
    "Recreation and movement",
    "Light exercise or stretching, games, music, and arts and crafts.",
  ],
  [
    "1:30 to 2:30 PM",
    "Community and group activities",
    "Community participation or an indoor group activity, with opportunities to practice communication.",
  ],
  [
    "3:30 to 4:00 PM",
    "Wrap-up and departure",
    "Review the day and prepare for departure.",
  ],
];

function PrimaryCta({ className = "" }) {
  return (
    <Link className={`button button-primary ${className}`.trim()} to="/book">
      Book a free conversation <CalendarDays size={17} aria-hidden="true" />
    </Link>
  );
}

function TextLink({ to, children }) {
  return (
    <Link className="text-link" to={to}>
      {children} <ArrowDownRight size={17} aria-hidden="true" />
    </Link>
  );
}

function SectionLabel({ children, number }) {
  return (
    <div className="section-label">
      <span className="label-rule" />
      {number && <span>{number}</span>}
      {children}
    </div>
  );
}

function ArrowLink({ to, children }) {
  return (
    <Link className="arrow-link" to={to}>
      {children} <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  );
}

function RepImage({ slot, className = "" }) {
  const image = images[slot];
  if (!image) return null;
  return (
    <figure className={`rep-image ${className}`.trim()}>
      <img src={image.src} alt={image.alt} loading="lazy" />
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  );
}

function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs wrap" aria-label="Breadcrumb">
      <ol>
        {items.map(([label, to], index) => (
          <li key={label}>
            {to ? (
              <Link to={to}>{label}</Link>
            ) : (
              <span aria-current="page">{label}</span>
            )}
            {index < items.length - 1 && (
              <span className="crumb-sep" aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="announcement">
        <span>
          <MapPin size={14} aria-hidden="true" /> {addressLine}
        </span>
        <span>{siteConfig.serviceArea}</span>
      </div>
      <header className="site-header">
        <div className="header-inner wrap">
          <Link className="wordmark" to="/" aria-label={`${brandName} home`}>
            <img
              className="brand-logo"
              src="/images/brand-logo.png"
              alt="Arizona Development Center DTA and DTT"
            />
          </Link>
          <button
            className="menu-button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <nav
            className={`primary-navigation${menuOpen ? " is-open" : ""}`}
            id="primary-navigation"
            aria-label="Main navigation"
          >
            {primaryNavigation.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {label}
              </NavLink>
            ))}
            <PrimaryCta className="header-cta" />
          </nav>
        </div>
      </header>
    </>
  );
}

function MobileCtaBar() {
  const location = useLocation();
  if (location.pathname === "/admin") return null;
  return (
    <div className="mobile-cta-bar">
      <PrimaryCta className="mobile-cta-primary" />
      {siteConfig.phone && (
        <a className="mobile-cta-call" href={telHref(siteConfig.phone)}>
          <Phone size={17} aria-hidden="true" /> Call
        </a>
      )}
    </div>
  );
}

function HomePage() {
  return (
    <main id="main">
      <section className="hero" aria-labelledby="home-title">
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <SectionLabel>
              Home and Community-Based Services · Peoria, Arizona
            </SectionLabel>
            <h1 id="home-title">
              DTA and DTT,
              <br />
              <em>centered on you.</em>
            </h1>
            <p className="hero-deck">
              Compassionate, person-centered support for adults and children
              with developmental disabilities. Build skills, find connection,
              and take part in the community, with family partnership at every
              step.
            </p>
            <div className="hero-actions">
              <PrimaryCta />
              <TextLink to="/services">See program options</TextLink>
            </div>
            <p className="hero-note">You can start with a question. No plan needed.</p>
          </div>
          <div className="hero-media">
            <RepImage slot="hero" />
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="About Arizona Development Center">
        <div className="wrap trust-grid">
          {[
            ["Peoria, Arizona", "Local day programs"],
            ["DTA and DTT", "Adults, children & youth"],
            ["Person-centered", "Goals, choice & dignity"],
            ["Family partnership", "Questions welcome"],
          ].map(([title, note]) => (
            <div className="trust-item" key={title}>
              <strong>{title}</strong>
              <span>{note}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section programs-section" id="programs">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <SectionLabel number="01">Our programs</SectionLabel>
              <h2>
                Support for
                <br />
                <em>different stages.</em>
              </h2>
            </div>
            <div className="section-intro">
              <p>
                Two focused Day Treatment and Training programs. Each day can
                create room for skill-building, relationships, and meaningful
                participation.
              </p>
              <ArrowLink to="/services">Explore both programs</ArrowLink>
            </div>
          </div>
          <ProgramGrid />
        </div>
      </section>

      <section className="section mission-section">
        <div className="wrap mission-grid">
          <RepImage slot="mission" className="mission-image" />
          <div className="mission-copy">
            <SectionLabel>Our mission</SectionLabel>
            <h2>
              Independence, dignity,
              <br />
              <em>and room to belong.</em>
            </h2>
            <p className="mission-statement">
              Our approach is grounded in person-centered care: listening to
              what matters to each individual and supporting meaningful
              participation in everyday life.
            </p>
            <p className="welcome-note">
              Families and guardians are valued partners. Every person deserves
              to be met with respect, choice, and encouragement.
            </p>
            <Link className="button button-secondary" to="/about">
              About the center <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section process-section" aria-labelledby="process-title">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <SectionLabel>How it works</SectionLabel>
              <h2 id="process-title">
                A clear path
                <br />
                <em>forward together.</em>
              </h2>
            </div>
            <p className="section-intro-p">
              Start with a question. We will help make the path forward clearer,
              one conversation at a time.
            </p>
          </div>
          <ProcessSteps />
          <div className="section-center">
            <TextLink to="/how-it-works">What to expect</TextLink>
          </div>
        </div>
      </section>

      <FamiliesSection />
      <StaffSection />

      <section className="section faq-home">
        <div className="wrap faq-home-grid">
          <div className="faq-home-heading">
            <SectionLabel>Frequently asked questions</SectionLabel>
            <h2>
              A few helpful
              <br />
              <em>first answers.</em>
            </h2>
            <ArrowLink to="/faqs">See all FAQs</ArrowLink>
          </div>
          <FaqList items={faqs.slice(0, 4)} />
        </div>
      </section>

      <ContactBanner />
    </main>
  );
}

function ProgramGrid() {
  return (
    <div className="program-grid">
      {services.map((service) => (
        <article className="program-card" key={service.id}>
          <RepImage slot={service.image} className="program-image" />
          <div className="program-body">
            <span className="program-eyebrow">
              {service.number} / {service.audience}
            </span>
            <h3>{service.title}</h3>
            <p className="program-short">{service.short}</p>
            <ul className="tick-list">
              {service.activities.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
            <Link className="button button-secondary" to={`/services/${service.slug}`}>
              Explore program <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

function ProcessSteps() {
  return (
    <ol className="process-grid">
      {processSteps.map(([number, title, text]) => (
        <li key={number}>
          <span className="step-number">{number}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </li>
      ))}
    </ol>
  );
}

function FamiliesSection() {
  if (testimonials.length === 0) {
    return (
      <section className="section families-section" aria-labelledby="families-title">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <SectionLabel>What families can expect</SectionLabel>
              <h2 id="families-title">
                Trust grows through
                <br />
                <em>the small things.</em>
              </h2>
            </div>
            <p className="section-intro-p">
              A familiar routine, a new skill practiced, a choice respected.
              Compassionate, person-centered support is built around what
              matters to the individual, with family involvement shaped by the
              person’s preferences and needs.
            </p>
          </div>
          <div className="expect-grid">
            <article>
              <span className="expect-icon"><CalendarDays size={22} /></span>
              <h3>How a day is structured</h3>
              <p>
                Activities balance learning, daily living, movement, creativity,
                and time together. The schedule may vary by day.
              </p>
              <ArrowLink to="/services/dta">See the adult program day</ArrowLink>
            </article>
            <article>
              <span className="expect-icon"><HeartHandshake size={22} /></span>
              <h3>How families stay informed</h3>
              <p>{dtaService.progress}</p>
              <ArrowLink to="/faqs">Read the FAQs</ArrowLink>
            </article>
            <article>
              <span className="expect-icon"><ShieldCheck size={22} /></span>
              <h3>How to start</h3>
              <p>
                Start with a question. We will help make the path forward
                clearer, one conversation at a time.
              </p>
              <ArrowLink to="/how-it-works">How it works</ArrowLink>
            </article>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section families-section" aria-labelledby="families-title">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <SectionLabel>What families say</SectionLabel>
            <h2 id="families-title">
              In their
              <br />
              <em>own words.</em>
            </h2>
          </div>
        </div>
        <div className={`quote-grid count-${Math.min(testimonials.length, 6)}`}>
          {testimonials.map((item) => (
            <figure className="quote-card" key={item.firstName + item.quote}>
              <blockquote>“{item.quote}”</blockquote>
              <figcaption>
                <strong>{item.firstName}</strong>
                <span>
                  {item.relationship}
                  {item.program ? ` · ${item.program}` : ""}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function StaffSection() {
  if (staff.length === 0) return null;
  return (
    <section className="section staff-section" aria-labelledby="staff-title">
      <div className="wrap">
        <SectionLabel>Who supports each program</SectionLabel>
        <h2 id="staff-title">
          The people
          <br />
          <em>beside the work.</em>
        </h2>
        <div className="staff-grid">
          {staff.map((person) => (
            <article key={person.name}>
              <h3>{person.name}</h3>
              <p className="staff-role">
                {person.role}
                {person.program ? ` · ${person.program}` : ""}
              </p>
              {person.bio && <p>{person.bio}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqList({ items }) {
  return (
    <div className="faq-list">
      {items.map((faq) => (
        <details key={faq.question}>
          <summary>
            {faq.question}
            <ChevronDown size={19} aria-hidden="true" />
          </summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

function ContactBanner() {
  return (
    <section className="final-cta">
      <div className="wrap final-cta-inner">
        <div>
          <SectionLabel>Your first conversation is simple</SectionLabel>
          <h2>
            Start with a question.
            <br />
            <em>We’ll listen.</em>
          </h2>
        </div>
        <PrimaryCta />
      </div>
    </section>
  );
}

function PageIntro({ label, title, lead, breadcrumbs }) {
  return (
    <>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <section className="page-intro wrap">
        <SectionLabel>{label}</SectionLabel>
        <h1>{title}</h1>
        <p>{lead}</p>
      </section>
    </>
  );
}

function ServicesPage() {
  return (
    <main id="main">
      <PageIntro
        label="Our services"
        title={
          <>
            Day Treatment
            <br />
            <em>and Training.</em>
          </>
        }
        lead="Arizona Development Center LLC provides Home and Community-Based Services (HCBS) through DTA for adults and DTT for children and youth at 11001 N 99th Ave., Peoria, Arizona 85345."
      />
      <section className="section services-hub">
        <div className="wrap">
          <h2 className="sr-only">Our programs</h2>
          <ProgramGrid />
          <div className="service-note">
            <div>
              <strong>Everyone is welcome to contact us.</strong>
              <p>
                We do not discriminate or turn people away from asking about
                services. Program fit, eligibility, support needs, safety, and
                current availability are discussed individually.
              </p>
            </div>
            <ArrowLink to="/contact">Ask about a program</ArrowLink>
          </div>
        </div>
      </section>
      <section className="section transport-section">
        <div className="wrap">
          <SectionLabel>Planning a visit</SectionLabel>
          <h2>
            Have a transportation
            <br />
            <em>question?</em>
          </h2>
          <div className="expect-grid">
            <article>
              <h3>Getting there</h3>
              <p>
                If getting there is something you would like to discuss, you are
                welcome to ask what options may be available and what area they
                might cover.
              </p>
            </article>
            <article>
              <h3>Accessible vehicles</h3>
              <p>
                You are welcome to ask about accessible vehicles and what
                details would help the center plan a safe fit.
              </p>
            </article>
          </div>
          <ArrowLink to="/contact">Ask about getting there</ArrowLink>
        </div>
      </section>
      <ContactBanner />
    </main>
  );
}

function ProgramDetailPage({ slug }) {
  const service = getService(slug);
  if (!service) return <NotFoundPage />;

  return (
    <main id="main">
      <Breadcrumbs
        items={[
          ["Home", "/"],
          ["Programs", "/services"],
          [service.title, ""],
        ]}
      />
      <PageIntro
        label={service.number + " / Program"}
        title={
          <>
            {service.title.split(" – ")[0]}
            <br />
            <em>{service.title.split(" – ")[1]}</em>
          </>
        }
        lead={service.short}
      />
      <section className="section detail-service wrap">
        <RepImage slot={service.image} className="detail-image" />
        <div className="detail-copy">
          <SectionLabel>Care pathway</SectionLabel>
          <h2>{service.audience}</h2>
          <p>{service.detail}</p>
          <ul className="tick-list">
            {service.activities.map((activity) => (
              <li key={activity}>{activity}</li>
            ))}
          </ul>
          <p className="progress-block">
            <strong>How progress is understood</strong>
            {service.progress}
          </p>
          <p>
            We’ll learn what kind of support you’re looking for, answer
            questions, and explain what can be discussed next. Specific
            services and eligibility depend on your circumstances and location.
          </p>
          <ArrowLink to="/contact">Ask about this service</ArrowLink>
        </div>
      </section>

      {service.slug === "dta" && (
        <section className="section schedule-section wrap" id="typical-day">
          <div className="section-heading">
            <div>
              <SectionLabel>Adult Day Training</SectionLabel>
              <h2>
                A typical day
                <br />
                <em>at Peoria.</em>
              </h2>
            </div>
            <p className="section-intro-p">
              Activities balance learning, daily living, movement, creativity,
              and time together. The schedule may vary by day.
            </p>
          </div>
          <div className="schedule-list">
            {dtaSchedule.map(([time, title, description]) => (
              <article className="schedule-row" key={time}>
                <p className="schedule-time">{time}</p>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <p className="meal-note">
            Members bring their own lunch and snacks each day. Food is labeled
            and stored safely; lunch is scheduled and supervised by staff.
          </p>
        </section>
      )}

      <section className="section service-note-wrap">
        <div className="wrap service-note">
          <div>
            <strong>Everyone is welcome to contact us.</strong>
            <p>
              We do not discriminate or turn people away from asking about
              services. Program fit, eligibility, support needs, safety, and
              current availability are discussed individually.
            </p>
          </div>
          <ArrowLink to="/contact">Ask about a program</ArrowLink>
        </div>
      </section>
      <ContactBanner />
    </main>
  );
}

function LegacyServiceHashRedirect() {
  const location = useLocation();
  if (
    location.pathname === "/services" &&
    (location.hash === "#dta" || location.hash === "#dtt")
  ) {
    return <Navigate to={`/services/${location.hash.slice(1)}`} replace />;
  }
  return null;
}

function StepsPage() {
  return (
    <main id="main">
      <PageIntro
        label="How it works"
        title={
          <>
            A conversation first.
            <br />
            <em>No pressure.</em>
          </>
        }
        lead="Every conversation starts with listening. We will learn what matters to the individual, answer questions, and explain what can be confirmed next."
      />
      <section className="section steps-page wrap">
        <h2 className="sr-only">The three steps</h2>
        <ProcessSteps />
      </section>
      <section className="plain-note wrap">
        <p>
          Care needs can be personal. For your privacy, do not send diagnoses,
          medication lists, or other sensitive health information through a
          general inquiry.
        </p>
        <ArrowLink to="/contact">Contact the care team</ArrowLink>
      </section>
      <ContactBanner />
    </main>
  );
}

function AboutPage() {
  return (
    <main id="main">
      <PageIntro
        label="Our approach"
        title={
          <>
            People are not
            <br />
            <em>checklists.</em>
          </>
        }
        lead="Arizona Development Center offers Home and Community-Based Services (HCBS) through DTA and DTT programs in Peoria. Our person-centered approach supports independence, dignity, skill-building, and meaningful community participation."
      />
      <section className="section about-story wrap">
        <RepImage slot="dtt" className="about-image" />
        <div>
          <SectionLabel>Our commitment</SectionLabel>
          <h2>Compassionate, person-centered support.</h2>
          <p>
            At 11001 N 99th Ave in Peoria, Arizona Development Center provides
            Day Treatment and Training – Adult (DTA) and Day Treatment and
            Training – Kids (DTT) for individuals with developmental
            disabilities, including autism spectrum and behavioral or emotional
            support needs.
          </p>
          <p>
            Each person brings their own strengths, interests, and goals. We
            value family partnership and encourage questions about how a
            tailored care plan, skill-building, and progress updates work in
            practice.
          </p>
          <ArrowLink to="/contact">Meet us in conversation</ArrowLink>
        </div>
      </section>
      <ContactBanner />
    </main>
  );
}

function CareersPage() {
  return (
    <main id="main">
      <PageIntro
        label="Careers"
        title={
          <>
            Care is work
            <br />
            <em>that matters.</em>
          </>
        }
        lead="The everyday moments are the work: showing up, paying attention, and helping someone move through their day with more confidence."
      />
      <section className="section career-section wrap">
        <div className="career-quote">
          <span>FOR PEOPLE WHO CARE</span>
          <HeartHandshake size={38} strokeWidth={1.4} />
          <p>
            Good care asks for patience, consistency, and respect for the person
            in front of you.
          </p>
        </div>
        <div className="career-copy">
          <h2>Interested in joining the team?</h2>
          <p>
            Reach out to ask about current opportunities and the experience or
            qualifications needed for a specific role. Role requirements and
            availability can change, so the team can give you the most accurate
            details.
          </p>
          <p>
            Do not send Social Security numbers, identity documents, or other
            sensitive information in an initial inquiry.
          </p>
          <ArrowLink to="/contact?topic=careers">Ask about care roles</ArrowLink>
        </div>
      </section>
      <ContactBanner />
    </main>
  );
}

function FindCarePage() {
  return (
    <main id="main">
      <PageIntro
        label="Program inquiries"
        title={
          <>
            Start with a
            <br />
            <em>conversation.</em>
          </>
        }
        lead="Ask about Day Treatment and Training for Adults (DTA), Day Treatment and Training for Children and Youth (DTT), or getting to the Peoria center. The team can explain program details and availability."
      />
      <section className="section find-care wrap">
        <div>
          <SectionLabel>11001 N 99th Ave., Peoria</SectionLabel>
          <h2>
            Everyone is welcome
            <br />
            <em>to ask.</em>
          </h2>
          <p>
            We do not discriminate or close our doors to anyone. Program fit,
            eligibility, support needs, safety, and current availability are
            discussed individually.
          </p>
          <PrimaryCta />
        </div>
        <ol className="find-care-steps">
          {[
            ["01", "Tell us which program", "Ask about DTA for adults or DTT for children and youth."],
            ["02", "Discuss the day", "Share what activities or support you want to understand. Please leave sensitive health details out of the first message."],
            ["03", "Confirm details", "The center can discuss program fit, availability, pickup, and wheelchair van arrangements."],
          ].map(([n, title, text]) => (
            <li key={n}>
              <span>{n}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <ContactBanner />
    </main>
  );
}

function SafetyPage() {
  const questions = [
    "What qualifications or training does this role require?",
    "What screening steps are completed, and when?",
    "Who supervises the care and handles concerns?",
    "How are schedules, changes, and emergencies communicated?",
    "What services are included, and what falls outside their scope?",
  ];
  return (
    <main id="main">
      <PageIntro
        label="Safety & quality"
        title={
          <>
            Clear answers are
            <br />
            <em>part of good care.</em>
          </>
        }
        lead="Every care arrangement is different. Ask specific questions and make sure you understand how a provider’s policies work before services begin."
      />
      <section className="section safety-content wrap">
        <div className="safety-callout">
          <ShieldCheck size={34} strokeWidth={1.4} />
          <h2>Ask what happens in practice.</h2>
          <p>
            Policies, credentials, and screening requirements depend on the role
            and service. Confirm the details directly with the care team rather
            than relying on a general statement.
          </p>
        </div>
        <div className="question-list">
          {questions.map((question, index) => (
            <div key={question}>
              <span>0{index + 1}</span>
              <p>{question}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="plain-note wrap">
        <p>
          Do not use this website for emergencies. Call 911 in the United States
          if someone is in immediate danger.
        </p>
      </section>
      <ContactBanner />
    </main>
  );
}

function FAQPage() {
  return (
    <main id="main">
      <PageIntro
        label="Frequently asked questions"
        title={
          <>
            Good questions
            <br />
            <em>deserve plain answers.</em>
          </>
        }
        lead="Here are a few helpful starting points. Details may depend on the service and your location, so we encourage you to ask about your situation."
      />
      <section className="section faq-page wrap">
        <FaqList items={faqs} />
      </section>
      <ContactBanner />
    </main>
  );
}

function topicFromParam(param) {
  if (param === "careers") return "Caregiver opportunities";
  if (param === "appointment") return "Care consultation / appointment";
  return "";
}

function ContactPage() {
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get("topic");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [topic, setTopic] = useState(() => topicFromParam(topicParam));

  useEffect(() => setTopic(topicFromParam(topicParam)), [topicParam]);

  const isAppointment = topic === "Care consultation / appointment";
  const localToday = new Date();
  localToday.setMinutes(
    localToday.getMinutes() - localToday.getTimezoneOffset(),
  );
  const minimumDate = localToday.toISOString().slice(0, 10);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (formData.get("website")) {
      setStatus("Thank you for your message.");
      return;
    }
    if (!formData.get("consent")) {
      setStatus("Please agree to be contacted before submitting.");
      return;
    }

    const interest = String(formData.get("interest") || "");
    const program = interest.includes("Adult")
      ? "dta"
      : interest.includes("Kids")
        ? "dtt"
        : "unsure";
    const timeMap = {
      Morning: "morning",
      Afternoon: "afternoon",
      "Early evening": "early-evening",
    };

    setSubmitting(true);
    setStatus("");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone") || "",
          city: formData.get("location"),
          program,
          participantAge: "",
          contactMethod: formData.get("phone") ? "phone" : "email",
          preferredDate: formData.get("preferred-date") || "",
          preferredTime: timeMap[formData.get("preferred-time")] || "",
          notes: `Website inquiry: ${interest}`,
          consent: true,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || data.error || "Could not send your request.");
      }
      setStatus(
        `Thank you, your request was received. Your reference is ${data.reference}. The care team will follow up. This is not a confirmed appointment.`,
      );
      form.reset();
      setTopic(topicFromParam(topicParam));
    } catch (error) {
      setStatus(`We could not send that right now. ${error.message || "Please try again."}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main id="main">
      <PageIntro
        label="Contact"
        title={
          <>
            Request Home &
            <br />
            <em>Community-Based Support.</em>
          </>
        }
        lead="Request a free initial consultation about DTA or DTT in Peoria. Share how to reach you and what you would like to discuss. Please keep private health details out of this form."
      />
      <section className="section contact-layout wrap">
        <aside className="contact-aside">
          <span className="contact-aside-mark"><Phone size={23} /></span>
          <h2>Visit the Peoria center</h2>
          <p>Home and Community-Based Services (HCBS) through DTA and DTT.</p>
          <ContactDetails />
          <p className="small-print">
            Call 911 in the United States if someone is in immediate danger.
          </p>
        </aside>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <h2>{isAppointment ? "Request a free conversation" : "Send a short note"}</h2>
            <p>
              {isAppointment
                ? "Share a preferred day and time. The team will follow up to discuss availability. This is a request, not a confirmed appointment."
                : "Required fields are marked with an asterisk."}
            </p>
          </div>
          <div className="honeypot-field" aria-hidden="true">
            <label>
              Leave this field empty
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <label>
            Your name <span>*</span>
            <input name="name" autoComplete="name" required maxLength="100" />
          </label>
          <label>
            Email address <span>*</span>
            <input type="email" name="email" autoComplete="email" required maxLength="254" />
          </label>
          <label>
            Phone number <small>Optional</small>
            <input type="tel" name="phone" autoComplete="tel" maxLength="30" />
          </label>
          <label>
            City or ZIP code <span>*</span>
            <input name="location" required maxLength="80" autoComplete="postal-code" />
          </label>
          <label>
            What are you asking about? <span>*</span>
            <select name="interest" value={topic} onChange={(e) => setTopic(e.target.value)} required>
              <option value="">Choose one</option>
              <option>Day Treatment and Training – Adult (DTA)</option>
              <option>Day Treatment and Training – Kids (DTT)</option>
              <option>Transportation question</option>
              <option>Caregiver opportunities</option>
              <option>Care consultation / appointment</option>
              <option>Something else</option>
            </select>
          </label>
          {isAppointment && (
            <div className="form-row">
              <label>
                Preferred day <small>Optional</small>
                <input type="date" name="preferred-date" min={minimumDate} />
              </label>
              <label>
                Preferred time <small>Optional</small>
                <select name="preferred-time" defaultValue="">
                  <option value="">No preference</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Early evening</option>
                </select>
              </label>
            </div>
          )}
          <label className="consent-label">
            <input type="checkbox" name="consent" />
            <span>
              I agree that Arizona Development Center may contact me about this
              request. <strong>*</strong>
            </span>
          </label>
          <p className="form-privacy">
            Your request is sent securely to the care team and saved in our
            booking system. Please do not include diagnoses, medications, or
            other sensitive health information.
          </p>
          <button className="button button-primary" type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Send my request"}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
          {status && <p className="form-status" role="status">{status}</p>}
        </form>
      </section>
      <ContactBanner />
    </main>
  );
}

function PolicyPage({ title, intro, sections }) {
  return (
    <main id="main">
      <PageIntro label="Information" title={title} lead={intro} />
      <section className="policy-content wrap">
        {sections.map(([heading, copy]) => (
          <article key={heading}>
            <h2>{heading}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>
      <p className="policy-disclaimer wrap">
        This page is general website information, not legal advice. The business
        should have its policies reviewed for the locations and services it
        operates.
      </p>
    </main>
  );
}

function CookiePage() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(
    () =>
      typeof localStorage !== "undefined" &&
      localStorage.getItem("analytics-preference") === "allowed",
  );
  const [saved, setSaved] = useState(false);
  return (
    <main id="main">
      <PageIntro
        label="Your choices"
        title={
          <>
            A little control
            <br />
            <em>goes a long way.</em>
          </>
        }
        lead="This site does not currently load analytics or advertising cookies. You can save your preference here; it will stay on this browser."
      />
      <section className="cookie-controls wrap">
        <div>
          <h2>Optional analytics</h2>
          <p>
            No analytics tool is currently connected. This setting records your
            choice locally and does not enable tracking by itself.
          </p>
        </div>
        <label className="switch-label">
          <input
            type="checkbox"
            checked={analyticsAllowed}
            onChange={(e) => {
              setAnalyticsAllowed(e.target.checked);
              setSaved(false);
            }}
          />
          <span>{analyticsAllowed ? "Allowed" : "Not allowed"}</span>
        </label>
        <button
          className="button button-primary"
          onClick={() => {
            localStorage.setItem(
              "analytics-preference",
              analyticsAllowed ? "allowed" : "not-allowed",
            );
            setSaved(true);
          }}
        >
          {saved ? <><Check size={17} /> Preference saved</> : "Save preference"}
        </button>
        {saved && (
          <p className="form-status" role="status">
            Your preference has been saved on this browser.
          </p>
        )}
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main id="main" className="not-found-page">
      <section className="not-found-content wrap">
        <SectionLabel>Page not found</SectionLabel>
        <h1>
          This page isn’t
          <br />
          <em>where it should be.</em>
        </h1>
        <p>
          The address may have changed. Start again with care options or get in
          touch with the team.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/">
            Go to home <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <TextLink to="/services">Explore care options</TextLink>
        </div>
      </section>
    </main>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-main">
        <div className="footer-about">
          <Link className="wordmark footer-wordmark" to="/" aria-label={`${brandName} home`}>
            <img
              className="brand-logo"
              src="/images/brand-logo.png"
              alt="Arizona Development Center DTA and DTT"
            />
          </Link>
          <p>Home and Community-Based Services (HCBS) through DTA and DTT.</p>
          <ContactDetails compact showHeading={false} />
          <ArrowLink to="/contact">Questions? Start here</ArrowLink>
        </div>
        <div className="footer-column">
          <h2>Explore</h2>
          <Link to="/services">Programs</Link>
          <Link to="/services/dta">Adult program (DTA)</Link>
          <Link to="/services/dtt">Kids program (DTT)</Link>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/about">Our approach</Link>
        </div>
        <div className="footer-column">
          <h2>Connect</h2>
          <Link to="/book">Book a free conversation</Link>
          <Link to="/find-care">Program inquiries</Link>
          <Link to="/faqs">Frequently asked questions</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/safety">Safety & quality</Link>
        </div>
        <div className="footer-column">
          <h2>Information</h2>
          <Link to="/privacy">Privacy notice</Link>
          <Link to="/terms">Terms of use</Link>
          <Link to="/cancellation">Cancellation policy</Link>
          <Link to="/cookies">Cookie preferences</Link>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <p>© {new Date().getFullYear()} {brandName}</p>
        <p>Peoria, Arizona</p>
      </div>
    </footer>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    const meta = metaForPath(location.pathname);
    document.title = `${meta.title} | ${brandName}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta.description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", `${siteConfig.url}${location.pathname}`);
    const ld = document.getElementById("page-ld");
    if (ld) ld.textContent = JSON.stringify(jsonLdForPath(location.pathname));

    if (location.hash) {
      requestAnimationFrame(() =>
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView(),
      );
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <SiteHeader />
      <LegacyServiceHashRedirect />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/dta" element={<ProgramDetailPage slug="dta" />} />
        <Route path="/services/dtt" element={<ProgramDetailPage slug="dtt" />} />
        <Route path="/how-it-works" element={<StepsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/find-care" element={<FindCarePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/faqs" element={<FAQPage />} />
        <Route
          path="/privacy"
          element={
            <PolicyPage
              title={<>
                Privacy starts
                <br />
                <em>with less data.</em>
              </>}
              intro="This website should only ask for the information needed to respond to a general inquiry. Do not send sensitive health details through the public contact form."
              sections={[
                [
                  "Information you choose to share",
                  "The contact form asks for your name, email address, an optional phone number, and the kind of service you want to discuss. Your request is sent to the care team through this website and saved so it can be followed up.",
                ],
                [
                  "Sensitive information",
                  "Please do not submit diagnoses, medications, financial information, government identification numbers, or other sensitive personal information in a general inquiry.",
                ],
                [
                  "Cookies and analytics",
                  "No analytics or advertising cookies are currently connected. Cookie preferences saved on this browser are stored locally.",
                ],
                [
                  "Before launch",
                  "The business should confirm its actual data practices, retention periods, vendors, contact information, and applicable privacy obligations before publishing this notice.",
                ],
              ]}
            />
          }
        />
        <Route
          path="/terms"
          element={
            <PolicyPage
              title={<>
                Clear terms
                <br />
                <em>matter.</em>
              </>}
              intro="These general terms are a starting point for website use. They do not describe a care agreement or replace signed service documents."
              sections={[
                [
                  "Website information",
                  "Service descriptions are general information and do not guarantee eligibility, availability, a particular outcome, or a specific service. Confirm details directly with the business.",
                ],
                [
                  "No emergency or medical service",
                  "Do not use this site for emergency assistance or medical advice. Call 911 in the United States in an emergency.",
                ],
                [
                  "Service agreements",
                  "Any care arrangement, fees, responsibilities, cancellation terms, and service boundaries should be set out in the current agreement provided by the business.",
                ],
                [
                  "Before launch",
                  "Have an attorney review and replace this general information with terms appropriate to the business and the places where it operates.",
                ],
              ]}
            />
          }
        />
        <Route
          path="/cancellation"
          element={
            <PolicyPage
              title={<>
                Plans can change.
                <br />
                <em>Know the details.</em>
              </>}
              intro="Cancellation, rescheduling, and refund terms depend on the service agreement. Please confirm the current policy with the business before services are arranged."
              sections={[
                [
                  "Ask before scheduling",
                  "Confirm notice periods, fees, missed visits, holiday arrangements, and how to request a change.",
                ],
                [
                  "Written agreement",
                  "The written service agreement should explain which payments may be refunded and when.",
                ],
                [
                  "Current policy",
                  "No specific cancellation or refund terms were provided for this website. The business should add its approved policy here before launch.",
                ],
              ]}
            />
          }
        />
        <Route path="/cookies" element={<CookiePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
      <MobileCtaBar />
    </>
  );
}

export default App;
