import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import BookingPage from "./BookingPage.jsx";
import AdminPage from "./AdminPage.jsx";
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
  MoveUpRight,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";
const childImage = "/images/dtt-circle-time.jpg";
const adultProgramImage = "/images/adult_care.jpg";
const heroImage = childImage;
const brandName = "Arizona Development Center LLC";

const serviceItems = [
  {
    number: "01",
    id: "dta",
    title: "Day Treatment and Training – Adult (DTA)",
    audience: "For adults with developmental disabilities",
    short:
      "A welcoming, structured day focused on life skills, relationships, and participation at a pace that respects each person.",
    detail:
      "Day Treatment and Training for Adults offers a structured setting with life-skills practice, chair yoga and stretching, arts and food crafts, music, trivia and puzzles, social events, and community participation. Activities support skill-building and independence.",
    activities: [
      "Life skills development and everyday routines",
      "Social connection, movement, and creative activities",
      "Opportunities for community participation",
    ],
    progress:
      "Progress can be discussed around the person’s goals, participation, and skills practiced. Ask the team how updates are shared with individuals and families.",
    image: adultProgramImage,
    alt: "Representative image of adults taking part in a group activity",
  },
  {
    number: "02",
    id: "dtt",
    title: "Day Treatment and Training – Kids (DTT)",
    audience: "For children and youth with developmental disabilities",
    short:
      "Age-appropriate activities that encourage communication, confidence, learning, and meaningful connection with others.",
    detail:
      "Day Treatment and Training for Children and Youth includes age-appropriate learning, sensory-motor, cognitive, social, and independence-building activities. Ask the center about program fit and current availability.",
    activities: [
      "Communication, social, and learning activities",
      "Sensory-motor and age-appropriate skill-building",
      "Practice with routines, choice-making, and participation",
    ],
    progress:
      "Progress is personal. Ask how the team learns what matters to your child and how participation and emerging skills are communicated to families.",
    image: childImage,
    alt: "Representative image of children and a teacher taking part in a group activity",
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
  ["FAQs", "/faqs"],
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
        <span>
          <MapPin size={14} /> 11001 N 99th Ave, Peoria, AZ
        </span>
        <span>Serving Peoria and surrounding communities</span>
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
            <Link className="header-cta" to="/book">
              Book free consultation <CalendarDays size={16} />
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
              alt="Representative image of children taking part in a group learning activity"
              fetchPriority="high"
            />
            <span className="hero-credit">Representative image</span>
          </div>
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
                <Link
                  className="button button-paper"
                  to="/book"
                >
                  Book Free Consultation <CalendarDays size={17} />
                </Link>
                <Link className="text-action" to="/services">
                  See program options <ArrowDownRight size={17} />
                </Link>
              </div>
              <div className="hero-note">
                You can start with a question. No plan needed.
              </div>
            </div>
          </div>
        </section>

        <section
          className="trust-strip"
          aria-label="About Arizona Development Center"
        >
          <div className="wrap trust-strip-inner">
            <p>
              <strong>Peoria, Arizona</strong>
              <span>Local day programs</span>
            </p>
            <p>
              <strong>DTA + DTT</strong>
              <span>Adults, children & youth</span>
            </p>
            <p>
              <strong>Person-centered</strong>
              <span>Goals, choice & dignity</span>
            </p>
            <p>
              <strong>Family partnership</strong>
              <span>Questions welcome</span>
            </p>
          </div>
        </section>

        <section className="pathway-band" aria-label="Choose a program">
          <div className="wrap pathway-inner">
            <p>Start with the program that fits your family.</p>
            <div className="pathway-links">
              <a href="#dtt">
                Kids & youth (DTT) <ArrowDownRight size={16} />
              </a>
              <a href="#dta">
                Adult program (DTA) <ArrowDownRight size={16} />
              </a>
              <Link to="/how-it-works">
                How it works <ArrowDownRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="services-section wrap" id="services">
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
          <div className="service-list">
            {serviceItems.map((service) => (
              <article
                className="program-card"
                id={service.id}
                key={service.id}
              >
                <div className="program-card-image">
                  <img src={service.image} alt={service.alt} loading="lazy" />
                  <span>Representative image</span>
                </div>
                <div className="program-card-copy">
                  <span className="program-number">
                    {service.number} / PROGRAM
                  </span>
                  <p className="program-audience">{service.audience}</p>
                  <h3>{service.title}</h3>
                  <p>{service.short}</p>
                  <ul>
                    {service.activities.map((activity) => (
                      <li key={activity}>{activity}</li>
                    ))}
                  </ul>
                  <p className="program-progress">
                    <strong>How progress is understood</strong>
                    {service.progress}
                  </p>
                  <ArrowLink to={`/services#${service.id}`}>
                    Explore the program
                  </ArrowLink>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-home-section">
          <div className="wrap about-home-grid">
            <div className="about-home-photo">
              <img
                src={adultProgramImage}
                alt="Representative image of adults taking part in a group arts activity"
                loading="lazy"
              />
              <span className="about-photo-note">Representative image</span>
            </div>
            <div className="about-home-copy">
              <SectionLabel>Our mission</SectionLabel>
              <h2>
                Independence, dignity,
                <br />
                <em>and room to belong.</em>
              </h2>
              <p>
                Arizona Development Center provides Day Treatment and Training
                in Peoria for adults and children and youth with developmental
                disabilities. Our approach is grounded in person-centered care:
                listening to what matters to each individual and supporting
                meaningful participation in everyday life.
              </p>
              <p className="welcome-note">
                Families and guardians are valued partners. Every person
                deserves to be met with respect, choice, and encouragement.
              </p>
              <Link className="button button-dark" to="/about">
                About the center <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <HomeProcess />
        <HomeTestimonials />
        <HomeFAQs />
        <HomeTeam />

        <ContactBanner />
      </main>
    </>
  );
}

function HomeTestimonials() {
  return (
    <section
      className="home-testimonials"
      aria-labelledby="home-testimonials-title"
    >
      <div className="wrap home-testimonials-grid">
        <figure className="home-testimonial-photo">
          <img
            src={adultProgramImage}
            alt="Representative image of adults taking part in a group arts activity"
            loading="lazy"
          />
          <figcaption>
            Representative image; not an Arizona Development Center participant
            or testimonial.
          </figcaption>
        </figure>
        <div className="home-testimonials-inner">
          <SectionLabel>Person-centered, every day</SectionLabel>
          <h2 id="home-testimonials-title">
            Trust grows through
            <br />
            <em>the small things.</em>
          </h2>
          <p>
            A familiar routine, a new skill practiced, a choice respected.
            Compassionate, person-centered support is built around what matters
            to the individual, with family involvement shaped by the person’s
            preferences and needs.
          </p>
          <ArrowLink to="/about">Learn about our approach</ArrowLink>
        </div>
      </div>
    </section>
  );
}

function HomeProcess() {
  const steps = [
    [
      "01",
      "Book Appointment / Initial Consultation",
      "Tell us what you are looking for. We will listen, answer questions, and talk through program fit and the next step.",
    ],
    [
      "02",
      "Tailored Care Plan",
      "If the program may be a fit, discuss an individualized support plan shaped around the person’s strengths, preferences, support needs, and goals.",
    ],
    [
      "03",
      "Ongoing Support & Care",
      "Build skills and community participation through a consistent day, with communication about progress and changing needs.",
    ],
  ];

  return (
    <section className="home-process" aria-labelledby="home-process-title">
      <div className="wrap">
        <div className="process-heading">
          <div>
            <SectionLabel>How it works</SectionLabel>
            <h2 id="home-process-title">
              Seamless care in
              <br />
              <em>three steps.</em>
            </h2>
          </div>
          <p>
            Start with a question. We will help make the path forward clearer,
            one conversation at a time.
          </p>
        </div>
        <div className="process-grid">
          {steps.map(([number, title, description]) => (
            <article key={number}>
              <span className="process-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <Link className="button button-dark" to="/how-it-works">
          What to expect <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

function HomeFAQs() {
  return (
    <section className="home-faq-section wrap" aria-labelledby="home-faq-title">
      <div className="home-faq-heading">
        <SectionLabel>Frequently asked questions</SectionLabel>
        <h2 id="home-faq-title">
          A few helpful
          <br />
          <em>first answers.</em>
        </h2>
        <ArrowLink to="/faqs">See all FAQs</ArrowLink>
      </div>
      <div className="home-faq-list">
        {faqs.slice(0, 4).map(([question, answer]) => (
          <details key={question}>
            <summary>
              {question}
              <ChevronDown size={19} />
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function HomeTeam() {
  return (
    <section className="home-team-section">
      <div className="wrap home-team-grid">
        <figure className="home-team-photo">
          <img
            src={childImage}
            alt="Representative image of children taking part in a group learning activity"
            loading="lazy"
          />
          <figcaption>
            Representative program photo; not center staff.
          </figcaption>
        </figure>
        <div className="home-team-content">
          <div>
            <SectionLabel>Meet the team</SectionLabel>
            <h2>
              Support shaped
              <br />
              <em>around people.</em>
            </h2>
          </div>
          <div className="home-team-copy">
            <ul className="program-team-list">
              <li>Adult Day Treatment and Training (DTA)</li>
              <li>Kids Day Treatment and Training (DTT)</li>
              <li>Family communication and program questions</li>
            </ul>
            <p>
              The people who support each program are important partners in
              building a steady, respectful day. Contact the center to meet the
              appropriate program team and ask about training, qualifications,
              screening, and supervision.
            </p>
            <ArrowLink to="/about">About the center</ArrowLink>
          </div>
        </div>
      </div>
    </section>
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
        lead="Arizona Development Center LLC provides Home and Community-Based Services (HCBS) through DTA for adults and DTT for children and youth at 11001 N 99th Ave., Peoria, Arizona 85345."
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
              <ul className="detail-activity-list">
                {service.activities.map((activity) => (
                  <li key={activity}>{activity}</li>
                ))}
              </ul>
              <p className="detail-progress">
                <strong>How progress is understood</strong>
                {service.progress}
              </p>
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
          <SectionLabel>Planning a visit</SectionLabel>
          <h2>
            Have a transportation
            <br />
            <em>question?</em>
          </h2>
          <div className="other-service-list">
            <article>
              <h3>Transportation availability</h3>
              <p>
                Transportation is not confirmed as a current program service.
                Ask the center whether any options are available and what area
                they may cover.
              </p>
            </article>
            <article>
              <h3>Wheelchair van</h3>
              <p>
                Ask whether an accessible vehicle is available and what details
                the center needs to confirm a safe fit.
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
      "Book Appointment / Initial Consultation",
      "Share the kind of support you are looking for and the Arizona community where care may be needed. Please leave out private medical details in your first message.",
    ],
    [
      "02",
      "Tailored Care Plan",
      "If the program may be a fit, talk through the person’s strengths, preferences, support needs, and goals with the team and family.",
    ],
    [
      "03",
      "Ongoing Support & Care",
      "When services begin, support focuses on the person’s individualized goals, skill-building, and meaningful participation. Ask how progress and updates are shared.",
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
        lead="Every conversation starts with listening. We will learn what matters to the individual, answer questions, and explain what can be confirmed next."
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
        lead="Arizona Development Center offers Home and Community-Based Services (HCBS) through DTA and DTT programs in Peoria. Our person-centered approach supports independence, dignity, skill-building, and meaningful community participation."
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
          <ArrowLink to="/book">
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
    "DTA is Day Treatment and Training – Adult. DTT is Day Treatment and Training for Kids, also described as Children & Youth. Arizona Development Center offers both programs in Peoria. Ask the team about current program details and availability.",
  ],
  [
    "What activities are part of DTA?",
    "Activities may include social connection, teamwork, daily living skills, learning activities, movement, games, music, creative projects, and community participation. The schedule can vary; contact the center to confirm what a typical day currently includes.",
  ],
  [
    "What does DTT offer for children and youth?",
    "DTT activities may include age-appropriate learning, communication, sensory-motor, cognitive, social, and independence-building opportunities. Ask the center about program fit and current availability for your child.",
  ],
  [
    "Who may be eligible for a program?",
    "Eligibility and program fit depend on the person’s circumstances, current support plan, service authorization, and program requirements. Contact the center and the person’s support coordinator or referring professional to understand the applicable steps. Asking a question does not commit you to enrollment.",
  ],
  [
    "What does enrollment involve?",
    "The steps and documents needed can vary. After an initial conversation, ask the center what information, service authorization, assessments, or meetings are required, how long the process may take, and when a start date can be confirmed.",
  ],
  [
    "Does Arizona Development Center accept insurance or AHCCCS?",
    "Coverage, funding, and authorization can depend on the individual’s program and current service arrangements. Please confirm accepted funding sources, any costs, and required authorizations directly with the center before making plans.",
  ],
  [
    "Can family members be involved? Is parent training available?",
    "Family partnership is important. Ask how family members or guardians can be involved in discussions and updates, with the individual’s preferences and applicable privacy permissions respected. Confirm directly whether parent training is currently offered.",
  ],
  [
    "How are goals and progress discussed?",
    "Support should reflect the person’s strengths, preferences, and individualized goals. Ask how the team tracks participation and skill-building, reviews the support plan, and shares updates with the individual and family.",
  ],
  [
    "What should members bring for lunch?",
    "Members bring their own lunch and snacks. Food is labeled and stored safely, and lunch is scheduled with staff supervision and support.",
  ],
  [
    "Can you provide pickup or wheelchair van transportation?",
    "Transportation was not confirmed as a current program service. Contact the center to ask whether transportation is available, what area it may cover, and whether an accessible vehicle can be arranged.",
  ],
  [
    "What happens during an initial consultation?",
    "You can ask about DTA or DTT, share what you hope to learn, and hear what information or next steps may be needed. You do not need to have every answer ready, and you should not send sensitive health details through the website form.",
  ],
  [
    "Who can contact the center?",
    "Individuals, parents, guardians, family members, and support coordinators can contact the center with questions. Program participation, eligibility, support needs, and availability are discussed individually.",
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
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
  const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT;
  const [topic, setTopic] = useState(() => topicFromParam(topicParam));

  // Keep the form in sync with the URL when navigating between
  // /contact, /contact?topic=appointment and /contact?topic=careers
  // without a full page reload (e.g. from the footer links).
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
      setStatus("We could not process that request. Please try again.");
      return;
    }

    // Preferred path: post to a configured form endpoint when one is set.
    if (contactEndpoint) {
      setSubmitting(true);
      setStatus("");
      try {
        const response = await fetch(contactEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone") || "",
            location: formData.get("location"),
            interest: formData.get("interest"),
            preferredDate: formData.get("preferred-date") || "",
            preferredTime: formData.get("preferred-time") || "",
            isAppointment,
          }),
        });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        setStatus(
          "Thank you — your request was sent. The care team will follow up with you.",
        );
        form.reset();
        setTopic(topicFromParam(topicParam));
      } catch {
        setStatus(
          "We could not send that right now. Please try again, or use the email link on this page.",
        );
      } finally {
        setSubmitting(false);
      }
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
            Request Home &
            <br />
            <em>Community-Based Support.</em>
          </>
        }
        lead="Request a free initial consultation about DTA or DTT in Peoria. Share how to reach you and what you would like to discuss. Please keep private health details out of this form."
      />
      <section className="contact-layout wrap">
        <div className="contact-aside">
          <span className="contact-aside-mark">
            <Phone size={23} />
          </span>
          <h2>Visit the Peoria center</h2>
          <p>Home and Community-Based Services (HCBS) through DTA and DTT.</p>
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
              {isAppointment
                ? "Request a free consultation"
                : "Send a short note"}
            </h2>
            <p>
              {isAppointment
                ? "Share a preferred day and time. The team will follow up to discuss availability. This is a request, not a confirmed appointment."
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
              <option>Day Treatment and Training – Adult (DTA)</option>
              <option>Day Treatment and Training – Kids (DTT)</option>
              <option>Transportation question</option>
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
            {contactEndpoint
              ? "Your request will be sent securely to the care team. Please do not include diagnoses, medications, or other sensitive health information."
              : contactEmail
                ? "Your email app will open with a brief message to the care team. Please do not include diagnoses, medications, or other sensitive health information."
                : "This form is not ready to send. The business must configure a contact endpoint or its official contact email first. Please do not include diagnoses, medications, or other sensitive health information."}
          </p>
          <button
            className="button button-dark"
            type="submit"
            disabled={(!contactEmail && !contactEndpoint) || submitting}
            aria-busy={submitting}
          >
            {submitting ? "Sending…" : "Request a consultation"}
            <ArrowRight size={17} />
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
          <SectionLabel>Your first conversation is simple</SectionLabel>
          <h2>
            Start with a question.
            <br />
            <em>We’ll listen.</em>
          </h2>
        </div>
        <Link className="button button-paper" to="/book">
          Book Free Consultation <CalendarDays size={17} />
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
          <p>Home and Community-Based Services (HCBS) through DTA and DTT.</p>
          <address>
            11001 N 99th Ave.
            <br />
            Peoria, AZ 85345
          </address>
          <div className="footer-hours">
            <h2>Program Hours</h2>
            <p>DTA program day: 8:00 a.m.–4:00 p.m.</p>
            <small>
              Contact the center to confirm operating days and holiday hours.
            </small>
          </div>
          <Link to="/contact">
            Contact the care team <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="footer-column">
          <h2>Explore</h2>
          <Link to="/services">Services</Link>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/about">Our approach</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/safety">Safety & quality</Link>
        </div>
        <div className="footer-column">
          <h2>Programs & contact</h2>
          <Link to="/book">Book a consultation</Link>
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
        "DTA and DTT in Peoria, Arizona",
        "Arizona Development Center offers Home and Community-Based Services (HCBS) through adult DTA and children and youth DTT programs in Peoria, Arizona.",
      ],
      "/services": [
        "DTA and DTT programs",
        "Explore Day Treatment and Training – Adult (DTA) and Day Treatment and Training – Kids (DTT) at Arizona Development Center in Peoria, Arizona.",
      ],
      "/how-it-works": [
        "How getting started works",
        "Learn what to expect when you contact Arizona Development Center LLC about DTA and DTT programs.",
      ],
      "/about": [
        "Our approach to care",
        "Learn about Arizona Development Center’s person-centered HCBS approach and DTA and DTT programs in Peoria, Arizona.",
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
      "/book": [
        "Book a free consultation",
        "Request a free consultation about DTA or DTT at Arizona Development Center in Peoria, Arizona. A short conversation with the care team.",
      ],
      "/admin": [
        "Admin sign in",
        "Restricted admin area for Arizona Development Center.",
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
        <Route path="/book" element={<BookingPage />} />
        <Route path="/admin" element={<AdminPage />} />
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
