// Build-time prerendering: renders every route to real HTML and injects
// structured data generated from the same config and data files the site uses.
import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import React from "react";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const BRAND = "Arizona Development Center LLC";

const paths = [
  "/",
  "/services",
  "/services/dta",
  "/services/dtt",
  "/how-it-works",
  "/about",
  "/careers",
  "/find-care",
  "/contact",
  "/book",
  "/safety",
  "/faqs",
  "/privacy",
  "/terms",
  "/cancellation",
  "/cookies",
  "/admin",
];

const noindex = new Set(["/admin"]);

const attr = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");

function applyMeta(html, route, meta, jsonLd) {
  const title = `${meta.title} | ${BRAND}`;
  const robots = noindex.has(route)
    ? "noindex, nofollow, noarchive"
    : "index, follow, max-image-preview:large, max-snippet:-1";

  const replacements = [
    [/<title>[\s\S]*?<\/title>/, `<title>${attr(title)}</title>`],
    [/<meta name="description" content="[\s\S]*?" \/>/, `<meta name="description" content="${attr(meta.description)}" />`],
    [/<meta name="robots" content="[\s\S]*?" \/>/, `<meta name="robots" content="${robots}" />`],
    [/<meta property="og:title" content="[\s\S]*?" \/>/, `<meta property="og:title" content="${attr(title)}" />`],
    [/<meta property="og:description" content="[\s\S]*?" \/>/, `<meta property="og:description" content="${attr(meta.description)}" />`],
    [/<meta name="twitter:title" content="[\s\S]*?" \/>/, `<meta name="twitter:title" content="${attr(title)}" />`],
    [/<meta name="twitter:description" content="[\s\S]*?" \/>/, `<meta name="twitter:description" content="${attr(meta.description)}" />`],
    [/<script id="page-ld" type="application\/ld\+json"><\/script>/, `<script id="page-ld" type="application/ld+json">${JSON.stringify(jsonLd)}</script>`],
  ];
  for (const [pattern, value] of replacements) html = html.replace(pattern, value);
  return html;
}

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "warn",
});

try {
  const { default: App } = await vite.ssrLoadModule("/src/App.jsx");
  const { metaForPath, jsonLdForPath } = await vite.ssrLoadModule("/src/seo.js");
  const { siteConfig } = await vite.ssrLoadModule("/config/site.ts");
  const template = await readFile(path.join(ROOT, "dist", "index.html"), "utf8");

  for (const route of paths) {
    const markup = renderToString(
      React.createElement(StaticRouter, { location: route }, React.createElement(App)),
    );
    const html = applyMeta(
      template.replace('<div id="root"></div>', `<div id="root">${markup}</div>`),
      route,
      metaForPath(route),
      jsonLdForPath(route),
    );
    const outDir =
      route === "/" ? path.join(ROOT, "dist") : path.join(ROOT, "dist", route.slice(1));
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, "index.html"), html, "utf8");
    console.log(`prerendered ${route}`);
  }

  // Canonical URL in the static template comes from config at build time.
  const base = path.join(ROOT, "dist", "index.html");
  let baseHtml = await readFile(base, "utf8");
  baseHtml = baseHtml.replace(
    /<link rel="canonical" href="[\s\S]*?" \/>/,
    `<link rel="canonical" href="${siteConfig.url}/" />`,
  );
  await writeFile(base, baseHtml, "utf8");
} finally {
  await vite.close();
}
