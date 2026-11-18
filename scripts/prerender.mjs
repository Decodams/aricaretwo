// Build-time prerendering: turns the React SPA into real, content-filled HTML
// files for every public route so search engines and AI crawlers can read the
// site without executing JavaScript.
import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import React from "react";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SITE = "https://aricaretwo.vercel.app";
const BRAND = "Arizona Development Center LLC";

const pages = [
  { path: "/", title: "DTA and DTT in Peoria, Arizona", name: "Home" },
  { path: "/services", title: "DTA and DTT programs", name: "Programs" },
  { path: "/book", title: "Book a free consultation", name: "Book a consultation" },
  { path: "/how-it-works", title: "How getting started works", name: "How it works" },
  { path: "/about", title: "Our approach to care", name: "About" },
  { path: "/careers", title: "Careers in care", name: "Careers" },
  { path: "/find-care", title: "DTA and DTT program inquiries", name: "Program inquiries" },
  { path: "/contact", title: "Contact the care team", name: "Contact" },
  { path: "/safety", title: "Safety and quality questions", name: "Safety & quality" },
  { path: "/faqs", title: "Frequently asked questions", name: "FAQs" },
  { path: "/privacy", title: "Privacy notice", name: "Privacy notice" },
  { path: "/terms", title: "Terms of use", name: "Terms of use" },
  { path: "/cancellation", title: "Cancellation policy", name: "Cancellation policy" },
  { path: "/cookies", title: "Cookie preferences", name: "Cookie preferences" },
  { path: "/admin", title: "Admin sign in", name: "Admin", noindex: true },
];

const descriptions = {
  "/": "Arizona Development Center offers Home and Community-Based Services (HCBS) through adult DTA and children and youth DTT programs in Peoria, Arizona.",
  "/services": "Explore Day Treatment and Training – Adult (DTA) and Day Treatment and Training – Kids (DTT) at Arizona Development Center in Peoria, Arizona.",
  "/book": "Request a free consultation about DTA or DTT at Arizona Development Center in Peoria, Arizona. A short conversation with the care team.",
  "/how-it-works": "Learn what to expect when you contact Arizona Development Center LLC about DTA and DTT programs.",
  "/about": "Learn about Arizona Development Center’s person-centered HCBS approach and DTA and DTT programs in Peoria, Arizona.",
  "/careers": "Ask about care roles, current opportunities, and role qualifications in Arizona.",
  "/find-care": "Ask Arizona Development Center LLC about adult day training, child and youth programs, and transportation in Peoria.",
  "/contact": "Contact Arizona Development Center LLC at 11001 N 99th Ave., Peoria, AZ 85345.",
  "/safety": "Questions to ask about qualifications, screening, supervision, and care arrangements.",
  "/faqs": "Answers to common questions about care services, availability, cost, and privacy.",
  "/privacy": "How this website handles general inquiries and privacy preferences.",
  "/terms": "General terms for using the Arizona Development Center LLC website.",
  "/cancellation": "Information about confirming cancellation, rescheduling, and refund terms before arranging care.",
  "/cookies": "Manage your local preference for optional analytics on this website.",
  "/admin": "Restricted admin area for Arizona Development Center.",
};

const attr = (value) =>
  String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

function applyMeta(html, page) {
  const url = SITE + (page.path === "/" ? "/" : page.path);
  const title = `${page.title} | ${BRAND}`;
  const description = descriptions[page.path] || descriptions["/"];
  const robots = page.noindex ? "noindex, nofollow, noarchive" : "index, follow, max-image-preview:large, max-snippet:-1";

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${attr(title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[\s\S]*?" \/>/,
    `<meta name="description" content="${attr(description)}" />`,
  );
  html = html.replace(
    /<meta name="robots" content="[\s\S]*?" \/>/,
    `<meta name="robots" content="${attr(robots)}" />`,
  );
  html = html.replace(
    /<link rel="canonical" href="[\s\S]*?" \/>/,
    `<link rel="canonical" href="${attr(url)}" />`,
  );
  html = html.replace(
    /<meta property="og:title" content="[\s\S]*?" \/>/,
    `<meta property="og:title" content="${attr(title)}" />`,
  );
  html = html.replace(
    /<meta property="og:description" content="[\s\S]*?" \/>/,
    `<meta property="og:description" content="${attr(description)}" />`,
  );
  html = html.replace(
    /<meta property="og:url" content="[\s\S]*?" \/>/,
    `<meta property="og:url" content="${attr(url)}" />`,
  );
  html = html.replace(
    /<meta name="twitter:title" content="[\s\S]*?" \/>/,
    `<meta name="twitter:title" content="${attr(title)}" />`,
  );
  html = html.replace(
    /<meta name="twitter:description" content="[\s\S]*?" \/>/,
    `<meta name="twitter:description" content="${attr(description)}" />`,
  );

  if (!page.noindex) {
    const crumbs = [{ name: "Home", url: SITE + "/" }];
    if (page.path !== "/") crumbs.push({ name: page.name, url });
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
    html = html.replace(
      "</head>",
      `  <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>\n  </head>`,
    );
  }

  return html;
}

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "warn",
});

try {
  const { default: App } = await vite.ssrLoadModule("/src/App.jsx");
  const template = await readFile(path.join(ROOT, "dist", "index.html"), "utf8");

  for (const page of pages) {
    const markup = renderToString(
      React.createElement(StaticRouter, { location: page.path }, React.createElement(App)),
    );
    const html = applyMeta(
      template.replace('<div id="root"></div>', `<div id="root">${markup}</div>`),
      page,
    );

    const outDir = page.path === "/" ? path.join(ROOT, "dist") : path.join(ROOT, "dist", page.path.slice(1));
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, "index.html"), html, "utf8");
    console.log(`prerendered ${page.path}`);
  }
} finally {
  await vite.close();
}
