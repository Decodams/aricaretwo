import { siteConfig } from "../config/site.ts";
import { services, getService } from "../data/services.ts";
import { faqs } from "../data/faqs.ts";

const SITE = siteConfig.url.replace(/\/$/, "");

export const pageMeta = {
  "/": {
    title: "DTA and DTT in Peoria, Arizona",
    description:
      "Arizona Development Center offers person-centered day programs for adults (DTA) and children and youth (DTT) in Peoria, Arizona.",
    name: "Home",
  },
  "/services": {
    title: "Programs",
    description:
      "Explore Day Treatment and Training for adults (DTA) and for children and youth (DTT) at Arizona Development Center in Peoria, Arizona.",
    name: "Programs",
  },
  "/how-it-works": {
    title: "How it works",
    description:
      "A first conversation, a plan shaped around the person, and ongoing support with clear updates for families.",
    name: "How it works",
  },
  "/about": {
    title: "Our approach",
    description:
      "Person-centered support, dignity and family partnership at Arizona Development Center in Peoria, Arizona.",
    name: "About",
  },
  "/careers": {
    title: "Careers",
    description:
      "Ask about care roles and current opportunities at Arizona Development Center in Peoria, Arizona.",
    name: "Careers",
  },
  "/find-care": {
    title: "Program inquiries",
    description:
      "Ask about DTA for adults, DTT for children and youth, or getting to the Peoria center.",
    name: "Program inquiries",
  },
  "/contact": {
    title: "Contact the care team",
    description:
      "Start with a question. Contact Arizona Development Center in Peoria, Arizona.",
    name: "Contact",
  },
  "/book": {
    title: "Book a free conversation",
    description:
      "Request a free conversation about DTA or DTT at Arizona Development Center in Peoria, Arizona.",
    name: "Book a free conversation",
  },
  "/safety": {
    title: "Safety and quality",
    description:
      "Questions to ask about qualifications, screening, supervision and care arrangements.",
    name: "Safety and quality",
  },
  "/faqs": {
    title: "Frequently asked questions",
    description:
      "Answers to common questions about the programs, eligibility, funding and privacy.",
    name: "FAQs",
  },
  "/privacy": {
    title: "Privacy notice",
    description: "How this website handles general inquiries and privacy preferences.",
    name: "Privacy notice",
  },
  "/terms": {
    title: "Terms of use",
    description: "General terms for using the Arizona Development Center website.",
    name: "Terms of use",
  },
  "/cancellation": {
    title: "Cancellation policy",
    description: "Information about confirming cancellation and rescheduling.",
    name: "Cancellation policy",
  },
  "/cookies": {
    title: "Cookie preferences",
    description: "Manage your local preference for optional analytics on this website.",
    name: "Cookie preferences",
  },
  "/admin": {
    title: "Admin sign in",
    description: "Restricted admin area for Arizona Development Center.",
    name: "Admin",
  },
};

for (const service of services) {
  pageMeta[`/services/${service.slug}`] = {
    title: service.metaTitle,
    description: service.metaDescription,
    name: service.title,
  };
}

export function metaForPath(pathname) {
  return (
    pageMeta[pathname] || {
      title: "Page not found",
      description: "The requested page could not be found.",
      name: "Page not found",
    }
  );
}

function localBusiness() {
  const a = siteConfig.address;
  return {
    "@type": "LocalBusiness",
    "@id": `${SITE}/#organization`,
    name: siteConfig.brandName,
    url: SITE,
    description:
      "Home and Community-Based Services through Day Treatment and Training for adults (DTA) and children and youth (DTT).",
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      addressLocality: a.locality,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    areaServed: { "@type": "Place", name: siteConfig.serviceArea },
    knowsAbout: services.map((service) => service.title),
  };
}

function serviceSchema(service) {
  return {
    "@type": "Service",
    "@id": `${SITE}/services/${service.slug}#service`,
    name: service.title,
    serviceType: service.title,
    provider: { "@id": `${SITE}/#organization` },
    areaServed: { "@type": "Place", name: "Peoria, Arizona" },
    description: service.detail,
  };
}

function breadcrumb(trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, url], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: url,
    })),
  };
}

export function jsonLdForPath(pathname) {
  const graph = [localBusiness()];

  if (pathname.startsWith("/services/")) {
    const service = getService(pathname.split("/")[2]);
    if (service) graph.push(serviceSchema(service));
    graph.push(
      breadcrumb([
        ["Home", SITE],
        ["Programs", `${SITE}/services`],
        [service?.title || "Program", `${SITE}${pathname}`],
      ]),
    );
  } else if (pathname === "/services") {
    services.forEach((service) => graph.push(serviceSchema(service)));
    graph.push(breadcrumb([["Home", SITE], ["Programs", `${SITE}/services`]]));
  } else if (pathname === "/" || pathname === "/faqs") {
    graph.push({
      "@type": "FAQPage",
      "@id": `${SITE}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }

  if (pathname !== "/" && !pathname.startsWith("/services/") && pathname !== "/services") {
    const meta = metaForPath(pathname);
    graph.push(breadcrumb([["Home", SITE], [meta.name, `${SITE}${pathname}`]]));
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
