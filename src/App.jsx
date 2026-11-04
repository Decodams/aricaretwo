import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  HeartHandshake,
  Menu,
  MoveUpRight,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";
const childImage = "/images/dtt-circle-time.jpg";
const olderAdultImage =
  "https://images.unsplash.com/photo-1773227060032-1bfb40b2b376?auto=format&fit=crop&w=1400&q=85";
const heroImage = childImage;
const brandName = "Arizona Development Center LLC";

const serviceItems = [
  {
    number: "01",
    id: "dta",
    title: "DTA | Adult Day Training",
    short:
      "A structured day in Peoria with social, practical, physical, and learning activities for adults.",
    detail:
      "Day Treatment and Training for Adults offers a structured setting with life-skills practice, chair yoga and stretching, arts and food crafts, music, trivia and puzzles, social events, and community participation. Activities support skill-building and independence.",
    image: olderAdultImage,
    alt: "Adults spending time together in a community room",
    tone: "butter",
  },
  {
    number: "02",
    id: "dtt",
    title: "DTT | Child and Youth Training",
    short:
      "Structured activities for children and youth focused on learning, communication, and participation.",
    detail:
      "Day Treatment and Training for Children and Youth includes age-appropriate learning, sensory-motor, cognitive, social, and independence-building activities. Ask the center about program fit and current availability.",
    image: childImage,
    alt: "Children and teachers taking part in a classroom circle-time activity",
    tone: "butter",
  },
];

const dtaSchedule = [
  [
    "8:00–9:00 AM",
    "Arrival and check-in",
    "Members arrive with their lunch and snacks. Food is labeled and stored safely.",
  ],
  [
    "9:00–10:00 AM",
    "Morning group",
    "Greeting, the daily plan, and social-skills activities.",
  ],
  [
    "10:00–11:00 AM",
    "Teamwork and life skills",
    "Practice everyday tasks, hygiene, and simple shared responsibilities.",
  ],
  [
    "11:00 AM–12:00 PM",
    "Learning activities",
    "Reading, writing, or other basic learning activities.",
  ],
  [
    "12:00–12:30 PM",
    "Lunch",
    "Members eat the meals they brought. Staff provide supervision and support.",
  ],
  [
    "12:30–1:30 PM",
    "Recreation and movement",
    "Light exercise or stretching, games, music, and arts and crafts.",
  ],
  [
    "1:30–2:30 PM",
    "Community and group activities",
    "Community participation or an indoor group activity, with opportunities to practice communication.",
  ],
  [
    "2:30–3:30 PM",
    "Schedule details to confirm",
    "The supplied schedule does not list activities for this time. Contact the center to confirm the daily plan.",
  ],
  [
    "3:30–4:00 PM",
    "Wrap-up and departure",
    "Review the day and prepare for departure.",
  ],
];

const primaryNavigation = [
  ["Programs", "/services"],
  ["How it works", "/how-it-works"],
  ["About", "/about"],
];

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
        <span>DTA and DTT programs in Peoria, Arizona.</span>
        <Link to="/how-it-works">
          What to expect <ArrowRight size={14} />
        </Link>
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
            className="menu-button icon-button"
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
            <Link className="header-cta" to="/contact?topic=appointment">
              Book appointment <CalendarDays size={16} />
            </Link>
          </nav>
        </div>
      </header>
    </>
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

function ArrowLink({ to, children, light = false }) {
  return (
    <Link className={`arrow-link${light ? " arrow-link-light" : ""}`} to={to}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}

function HomePage() {
  return (
    <>
      <main id="main">
        <section className="hero" aria-labelledby="home-title">
          <div className="hero-art">
            <img
              src={heroImage}
              alt="Children and teachers taking part in a classroom circle-time activity"
              fetchPriority="high"
            />
          </div>
          <div className="wrap hero-inner">
            <div className="hero-copy">
              <SectionLabel>Arizona Development Center</SectionLabel>
              <h1 id="home-title">
                DTA and DTT
                <br />
                <em>in Peoria.</em>
              </h1>
              <p className="hero-deck">
                Day Treatment and Training programs for adults and children and
                youth. Visit us at 11001 N 99th Ave. in Peoria to learn about
                activities, transportation, and next steps.
              </p>
              <div className="hero-actions">
                <Link
                  className="button button-paper"
                  to="/contact?topic=appointment"
                >
                  Book appointment <CalendarDays size={17} />
                </Link>
                <Link className="text-action" to="/services">
                  See care options <ArrowDownRight size={17} />
                </Link>
              </div>
              <div className="hero-note">
                You can start with a question. No plan needed.
              </div>
            </div>
          </div>
        </section>

        <section className="pathway-band" aria-label="Care pathways">
          <div className="wrap pathway-inner">
            <p>Where would you like to begin?</p>
            <div className="pathway-links">
              <a href="#dtt">
                Children and youth <ArrowDownRight size={16} />
              </a>
              <a href="#dta">
                Adult program <ArrowDownRight size={16} />
              </a>
              <a href="#other-services">
                Transportation <ArrowDownRight size={16} />
              </a>
              <Link to="/contact?topic=appointment">
                Book appointment <CalendarDays size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="services-section wrap" id="services">
          <div className="section-heading">
            <div>
              <SectionLabel number="01">Ways we can help</SectionLabel>
              <h2>
                DTA and DTT
                <br />
                <em>programs.</em>
              </h2>
            </div>
            <div className="section-intro">
              <p>
                Arizona Development Center LLC offers DTA and DTT programs at
                its Peoria location. Ask us about transportation and a
                wheelchair van.
              </p>
              <ArrowLink to="/services">See all services</ArrowLink>
            </div>
          </div>
          <div className="service-list">
            {serviceItems.map((service) => (
              <article
                className={`service-row ${service.tone}`}
                id={service.id}
                key={service.id}
              >
                <div className="service-row-index">
                  {service.number}
                  <span />
                </div>
                <div className="service-row-copy">
                  <h3>{service.title}</h3>
                  <p>{service.short}</p>
                  <ArrowLink to={`/services#${service.id}`}>
                    Explore this kind of care
                  </ArrowLink>
                </div>
                <div className="service-row-image">
                  <img src={service.image} alt={service.alt} loading="lazy" />
                </div>
                <ArrowLink to={`/services#${service.id}`}>
                  <span className="sr-only">Explore {service.title}</span>
                </ArrowLink>
              </article>
            ))}
          </div>
        </section>

        <section className="approach-section">
          <div className="wrap approach-grid">
            <div className="approach-image">
              <img
                src={olderAdultImage}
                alt="An older man talking with an older woman in a community room"
                loading="lazy"
              />
            </div>
            <div className="approach-copy">
              <SectionLabel number="02">A thoughtful first step</SectionLabel>
              <h2>
                You don’t need
                <br />
                <em>a plan before you call.</em>
              </h2>
              <p>
                Tell us what a usual day looks like and where another pair of
                hands might help. We’ll listen, answer what we can, and be clear
                about what still needs checking.
              </p>
              <div className="approach-points">
                <div>
                  <span>01</span>
                  <p>
                    <strong>DTA and DTT</strong>
                    <br />
                    Day Treatment and Training for adults, children, and youth.
                  </p>
                </div>
                <div>
                  <span>02</span>
                  <p>
                    <strong>Activities with purpose</strong>
                    <br />
                    Practice life skills, communication, learning, movement, and
                    participation.
                  </p>
                </div>
                <div>
                  <span>03</span>
                  <p>
                    <strong>Ask about getting here</strong>
                    <br />
                    Contact the center about pickup and wheelchair van options.
                  </p>
                </div>
              </div>
              <ArrowLink to="/how-it-works">
                How getting started works
              </ArrowLink>
            </div>
          </div>
        </section>

        <section className="standards-section wrap">
          <div className="standards-heading">
            <SectionLabel number="03">Straight answers matter</SectionLabel>
            <h2>
              Ask us the
              <br />
              <em>specifics.</em>
            </h2>
          </div>
          <div className="standards-body">
            <ShieldCheck size={30} strokeWidth={1.5} />
            <p>
              Everyone is welcome to contact the center. We do not discriminate
              or close our doors to anyone. Program fit, eligibility, support
              needs, safety, and current availability are discussed
              individually.
            </p>
            <ArrowLink to="/safety">Read our safety questions</ArrowLink>
          </div>
        </section>

        <ContactBanner />
      </main>
    </>
  );
}

function PageIntro({ label, title, lead }) {
  return (
    <section className="page-intro wrap">
      <SectionLabel>{label}</SectionLabel>
      <h1>{title}</h1>
      <p>{lead}</p>
    </section>
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
        lead="Arizona Development Center LLC is a division of DTA/DTT, serving adults and children and youth at 11001 N 99th Ave., Peoria, Arizona 85345."
      />
      <div className="detail-services wrap">
        {serviceItems.map((service, index) => (
          <article
            className={`detail-service ${index % 2 ? "reverse" : ""}`}
            id={service.id}
            key={service.id}
          >
            <div className="detail-service-photo">
              <img src={service.image} alt={service.alt} loading="lazy" />
            </div>
            <div className="detail-service-copy">
              <SectionLabel number={service.number}>Care pathway</SectionLabel>
              <h2>{service.title}</h2>
              <p>{service.detail}</p>
              <p>
                We’ll learn what kind of support you’re looking for, answer
                questions, and explain what can be discussed next. Specific
                services and eligibility depend on your circumstances and
                location.
              </p>
              <ArrowLink to="/contact">Ask about this service</ArrowLink>
            </div>
          </article>
        ))}
        <div className="service-note">
          <strong>Everyone is welcome to contact us.</strong>
          <p>
            We do not discriminate or turn people away from asking about
            services. Program fit, eligibility, support needs, safety, and
            current availability are discussed individually.
          </p>
          <ArrowLink to="/contact">Ask about a program</ArrowLink>
        </div>
      </div>
      <section className="program-schedule wrap" id="dta-schedule">
        <div className="section-heading">
          <div>
            <SectionLabel>Adult Day Training</SectionLabel>
            <h2>
              A typical day
              <br />
              <em>at Peoria.</em>
            </h2>
          </div>
          <div className="section-intro">
            <p>
              Activities balance learning, daily living, movement, creativity,
              and time together. The schedule may vary by day.
            </p>
          </div>
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
          Members bring their own lunch and snacks each day. Food is labeled and
          stored safely; lunch is scheduled and supervised by staff.
        </p>
      </section>
      <section className="other-services" id="other-services">
        <div className="wrap other-services-inner">
          <SectionLabel>Other services</SectionLabel>
          <h2>
            Getting there
            <br />
            <em>is part of the plan.</em>
          </h2>
          <div className="other-service-list">
            <article>
              <h3>Patient / client transportation</h3>
              <p>
                Ask about transportation, including pickup arrangements, service
                area, scheduling, and availability.
              </p>
            </article>
            <article>
              <h3>Wheelchair van</h3>
              <p>
                Ask the team whether wheelchair van transportation is available
                for your trip and what mobility details they need to confirm a
                safe fit.
              </p>
            </article>
          </div>
          <ArrowLink to="/contact">Ask about transportation</ArrowLink>
        </div>
      </section>
      <ContactBanner />
    </main>
  );
}

function StepsPage() {
  const steps = [
    [
      "01",
      "Tell us a little about the situation",
      "Share the kind of support you are looking for and the Arizona community where care may be needed. Please leave out private medical details in your first message.",
    ],
    [
      "02",
      "Talk through the possibilities",
      "A member of the team can learn more, answer your questions, and explain which services, requirements, and availability need to be confirmed.",
    ],
    [
      "03",
      "Decide on a next step together",
      "If there may be a fit, the team can explain what information is needed, what the process involves, and what happens next. You can take the time you need to decide.",
    ],
  ];
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
        lead="You can start with a question. We’ll help make the next step clearer, without asking you to arrive with all the answers."
      />
      <section className="steps-list wrap">
        {steps.map(([number, title, text]) => (
          <article className="step-row" key={number}>
            <span>{number}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
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
        lead="The best place to begin is with the person: what matters to them, what a good day looks like, and what kind of support feels respectful."
      />
      <section className="about-story wrap">
        <div className="about-story-image">
          <img
            src={childImage}
            alt="Children taking part in a classroom circle-time activity"
            loading="lazy"
          />
        </div>
        <div>
          <SectionLabel>Arizona Development Center LLC</SectionLabel>
          <h2>Structured days. Skills for everyday life.</h2>
          <p>
            Arizona Development Center LLC, a division of DTA/DTT, offers
            structured day programs for adults and children and youth at its
            Peoria location.
          </p>
          <p>
            DTA and DTT activities can include social and communication
            practice, daily living skills, creative projects, learning,
            movement, and community participation. The center can discuss the
            program details that fit each person.
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
      <section className="career-section wrap">
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
          <ArrowLink to="/contact?topic=careers">
            Ask about care roles
          </ArrowLink>
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
        lead="Ask about Day Treatment and Training for Adults (DTA), Day Treatment and Training for Children and Youth (DTT), or transportation from the Peoria center. The team can explain program details and availability."
      />
      <section className="find-care-content wrap">
        <div className="find-care-intro">
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
          <ArrowLink to="/contact?topic=appointment">
            Ask about a program
          </ArrowLink>
        </div>
        <div className="find-care-steps">
          <article>
            <span>01</span>
            <div>
              <h3>Tell us which program</h3>
              <p>Ask about DTA for adults or DTT for children and youth.</p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>Discuss the day</h3>
              <p>
                Share what activities or support you want to understand. Please
                leave sensitive health details out of the first message.
              </p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>Confirm details</h3>
              <p>
                The center can discuss program fit, availability, pickup, and
                wheelchair van arrangements.
              </p>
            </div>
          </article>
        </div>
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
      <section className="safety-content wrap">
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

const faqs = [
  [
    "What do DTA and DTT mean?",
    "DTA is Day Treatment and Training for Adults. DTT is Day Treatment and Training for Children and Youth. Contact the Peoria center to ask about program details and current availability.",
  ],
  [
    "What activities are part of DTA?",
    "A typical day may include social skills, teamwork, life-skills practice, reading or writing, light exercise, games, music, arts and crafts, and community or group activities. The daily schedule can vary.",
  ],
  [
    "What should members bring for lunch?",
    "Members bring their own lunch and snacks. Food is labeled and stored safely, and lunch is scheduled with staff supervision and support.",
  ],
  [
    "Can you provide pickup or wheelchair van transportation?",
    "Ask the center about pickup arrangements, service area, scheduling, wheelchair van availability, and the information needed to confirm a safe fit.",
  ],
  [
    "Who can contact the center?",
    "Everyone is welcome to contact us. We do not discriminate. Program participation, eligibility, support needs, safety, and availability are discussed individually.",
  ],
  [
    "Can I send health details through the contact form?",
    "Please do not include diagnoses, medications, or sensitive health information in a general inquiry. The team can explain an appropriate way to discuss private details.",
  ],
];

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
      <section className="faq-list wrap">
        {faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <ChevronDown size={19} />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
      <ContactBanner />
    </main>
  );
}

function ContactPage() {
  const params = new URLSearchParams(window.location.search);
  const [status, setStatus] = useState("");
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
  const [topic, setTopic] = useState(
    params.get("topic") === "careers"
      ? "Caregiver opportunities"
      : params.get("topic") === "appointment"
        ? "Care consultation / appointment"
        : "",
  );
  const isAppointment = topic === "Care consultation / appointment";
  const localToday = new Date();
  localToday.setMinutes(
    localToday.getMinutes() - localToday.getTimezoneOffset(),
  );
  const minimumDate = localToday.toISOString().slice(0, 10);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get("website")) {
      setStatus("We could not process that request. Please try again.");
      return;
    }
    if (!contactEmail) {
      setStatus(
        "The care team’s official email address has not been added yet. Please confirm it before publishing this form.",
      );
      return;
    }
    const subject = encodeURIComponent(
      `${isAppointment ? "Appointment request" : "Website inquiry"}: ${formData.get("interest")}`,
    );
    const body = encodeURIComponent(
      `Name: ${formData.get("name")}\nEmail: ${formData.get("email")}\nPhone: ${formData.get("phone") || "Not provided"}\nLocation: ${formData.get("location")}\nInterested in: ${formData.get("interest")}\nPreferred day: ${formData.get("preferred-date") || "Not provided"}\nPreferred time: ${formData.get("preferred-time") || "Not provided"}\n\nPlease contact me to discuss next steps. This is a request, not a confirmed appointment.\n\nI have not included sensitive health information.`,
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    setStatus(
      isAppointment
        ? "Your email app should open with an appointment request draft. Your appointment is not confirmed until the care team replies."
        : "Your email app should open with a draft. Review and send it to contact the care team.",
    );
  }

  return (
    <main id="main">
      <PageIntro
        label="Contact"
        title={
          <>
            Let’s talk about
            <br />
            <em>what would help.</em>
          </>
        }
        lead="A first conversation can be simple. Share how to reach you and what kind of support you’re asking about. Please keep private health details out of this form."
      />
      <section className="contact-layout wrap">
        <div className="contact-aside">
          <span className="contact-aside-mark">
            <Phone size={23} />
          </span>
          <h2>Visit the Peoria center</h2>
          <p>Arizona Development Center LLC, a division of DTA/DTT.</p>
          <a
            className="email-link location-link"
            href="https://maps.google.com/?q=11001+N+99th+Ave,+Peoria,+AZ+85345"
            target="_blank"
            rel="noreferrer"
          >
            11001 N 99th Ave., Peoria, AZ 85345 <MoveUpRight size={15} />
          </a>
          <p>Everyone is welcome to contact us. We do not discriminate.</p>
          {contactEmail && (
            <a className="email-link" href={`mailto:${contactEmail}`}>
              Email the care team <MoveUpRight size={15} />
            </a>
          )}
          <p className="small-print">
            Call 911 in the United States if someone is in immediate danger.
          </p>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <h2>
              {isAppointment ? "Request an appointment" : "Send a short note"}
            </h2>
            <p>
              {isAppointment
                ? "Share a preferred day and time. The team will confirm availability."
                : "Required fields are marked with an asterisk."}
            </p>
          </div>
          <div className="honeypot-field" aria-hidden="true">
            <label>
              Leave this field empty
              <input
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>
          <label>
            Your name <span>*</span>
            <input name="name" autoComplete="name" required maxLength="100" />
          </label>
          <label>
            Email address <span>*</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              maxLength="254"
            />
          </label>
          <label>
            Phone number <small>Optional</small>
            <input type="tel" name="phone" autoComplete="tel" maxLength="30" />
          </label>
          <label>
            City or ZIP code <span>*</span>
            <input
              name="location"
              required
              maxLength="80"
              autoComplete="postal-code"
            />
          </label>
          <label>
            What are you asking about? <span>*</span>
            <select
              name="interest"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              required
            >
              <option value="">Choose one</option>
              <option>DTA | Adult Day Training</option>
              <option>DTT | Child and Youth Training</option>
              <option>Patient / client transportation</option>
              <option>Wheelchair van</option>
              <option>Caregiver opportunities</option>
              <option>Care consultation / appointment</option>
              <option>Something else</option>
            </select>
          </label>
          {isAppointment && (
            <div className="appointment-preferences">
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
          <p className="form-privacy">
            {contactEmail
              ? "Your email app will open with a brief message to the care team. Please do not include diagnoses, medications, or other sensitive health information."
              : "This form is not ready to send. The business must configure its official contact email first. Please do not include diagnoses, medications, or other sensitive health information."}
          </p>
          <button
            className="button button-dark"
            type="submit"
            disabled={!contactEmail}
          >
            Continue in email <ArrowRight size={17} />
          </button>
          {status && (
            <p className="form-status" role="status">
              {status}
            </p>
          )}
        </form>
      </section>
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
    () => localStorage.getItem("analytics-preference") === "allowed",
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
            onChange={(event) => {
              setAnalyticsAllowed(event.target.checked);
              setSaved(false);
            }}
          />
          <span>{analyticsAllowed ? "Allowed" : "Not allowed"}</span>
        </label>
        <button
          className="button button-dark"
          onClick={() => {
            localStorage.setItem(
              "analytics-preference",
              analyticsAllowed ? "allowed" : "not-allowed",
            );
            setSaved(true);
          }}
        >
          {saved ? (
            <>
              <Check size={17} /> Preference saved
            </>
          ) : (
            "Save preference"
          )}
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

function ContactBanner() {
  return (
    <section className="contact-banner">
      <div className="wrap banner-inner">
        <div>
          <SectionLabel>One conversation can help</SectionLabel>
          <h2>
            Let’s find a good
            <br />
            <em>place to begin.</em>
          </h2>
        </div>
        <Link className="button button-paper" to="/contact?topic=appointment">
          Book appointment <CalendarDays size={17} />
        </Link>
      </div>
    </section>
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
          <Link className="button button-dark" to="/">
            Go to home <ArrowRight size={17} />
          </Link>
          <Link className="text-action" to="/services">
            Explore care options <ArrowUpRight size={17} />
          </Link>
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
          <Link className="wordmark footer-wordmark" to="/">
            <img
              className="brand-logo footer-brand-logo"
              src="/images/brand-logo.png"
              alt="Arizona Development Center DTA and DTT"
            />
          </Link>
          <p>Arizona Development Center LLC, a division of DTA/DTT.</p>
          <address>
            11001 N 99th Ave.
            <br />
            Peoria, AZ 85345
          </address>
          <Link to="/contact">
            Contact the care team <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="footer-column">
          <h2>Explore</h2>
          <Link to="/services">Services</Link>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/about">Our approach</Link>
          <Link to="/safety">Safety & quality</Link>
        </div>
        <div className="footer-column">
          <h2>Programs & contact</h2>
          <Link to="/find-care">Program inquiries</Link>
          <Link to="/faqs">Frequently asked questions</Link>
          <Link to="/contact">Contact</Link>
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
        <p>© {new Date().getFullYear()} Arizona Development Center LLC</p>
        <p>Peoria, Arizona</p>
        <Link to="/contact">
          Questions? Start here <ArrowUpRight size={14} />
        </Link>
      </div>
    </footer>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    const metadata = {
      "/": [
        "DTA and DTT programs in Peoria",
        "Arizona Development Center LLC provides DTA and DTT programs in Peoria, Arizona, with transportation options to ask about.",
      ],
      "/services": [
        "Care services in Arizona",
        "Explore DTA Adult Day Training, DTT Child and Youth Training, patient/client transportation, and wheelchair van service in Peoria, Arizona.",
      ],
      "/how-it-works": [
        "How getting started works",
        "Learn what to expect when you contact Arizona Development Center LLC about DTA and DTT programs.",
      ],
      "/about": [
        "Our approach to care",
        "Learn about Arizona Development Center LLC, a division of DTA/DTT, in Peoria, Arizona.",
      ],
      "/careers": [
        "Careers in care",
        "Ask about care roles, current opportunities, and role qualifications in Arizona.",
      ],
      "/find-care": [
        "DTA and DTT program inquiries",
        "Ask Arizona Development Center LLC about adult day training, child and youth programs, and transportation in Peoria.",
      ],
      "/contact": [
        "Contact the care team",
        "Contact Arizona Development Center LLC at 11001 N 99th Ave., Peoria, AZ 85345.",
      ],
      "/safety": [
        "Safety and quality questions",
        "Questions to ask about qualifications, screening, supervision, and care arrangements.",
      ],
      "/faqs": [
        "Frequently asked questions",
        "Answers to common questions about care services, availability, cost, and privacy.",
      ],
      "/privacy": [
        "Privacy notice",
        "How this website handles general inquiries and privacy preferences.",
      ],
      "/terms": [
        "Terms of use",
        "General terms for using the Arizona Development Center LLC website.",
      ],
      "/cancellation": [
        "Cancellation policy",
        "Information about confirming cancellation, rescheduling, and refund terms before arranging care.",
      ],
      "/cookies": [
        "Cookie preferences",
        "Manage your local preference for optional analytics on this website.",
      ],
    };
    const [pageTitle, description] = metadata[location.pathname] ?? [
      "Page not found",
      "The requested page could not be found.",
    ];
    document.title = `${pageTitle} | ${brandName}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/how-it-works" element={<StepsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/find-care" element={<FindCarePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/faqs" element={<FAQPage />} />
        <Route
          path="/privacy"
          element={
            <PolicyPage
              title={
                <>
                  Privacy starts
                  <br />
                  <em>with less data.</em>
                </>
              }
              intro="This website should only ask for the information needed to respond to a general inquiry. Do not send sensitive health details through the public contact form."
              sections={[
                [
                  "Information you choose to share",
                  "The contact form asks for your name, email address, an optional phone number, and the kind of service you want to discuss. When you continue, your email application prepares a message for you to send. This website does not currently submit inquiry data to a server.",
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
              title={
                <>
                  Clear terms
                  <br />
                  <em>matter.</em>
                </>
              }
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
              title={
                <>
                  Plans can change.
                  <br />
                  <em>Know the details.</em>
                </>
              }
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
    </>
  );
}

export default App;
