// Serves the same /api handlers used by Vercel during local `vite` development.
export function apiDevPlugin() {
  return {
    name: "api-dev-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/")) return next();

        let pathname;
        try {
          pathname = new URL(req.url, "http://localhost").pathname.replace(/\/$/, "");
        } catch {
          return next();
        }

        let modulePath = null;
        let bookingId = null;

        if (pathname === "/api/bookings") {
          modulePath = "/api/bookings/index.js";
        } else if (/^\/api\/bookings\/[^/]+$/.test(pathname)) {
          modulePath = "/api/bookings/[id].js";
          bookingId = decodeURIComponent(pathname.split("/").pop());
        } else if (/^\/api\/admin\/[a-z]+$/.test(pathname)) {
          modulePath = `${pathname}.js`;
        }

        if (!modulePath) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ ok: false, error: "Not found." }));
        }

        try {
          // Vite does not parse request bodies for middleware.
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const raw = Buffer.concat(chunks).toString("utf8");
          req.body = raw || {};
          req.query = { ...(req.query || {}), ...(bookingId ? { id: bookingId } : {}) };

          const mod = await server.ssrLoadModule(modulePath);
          await mod.default(req, res);
        } catch (error) {
          console.error("API dev middleware error:", error);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, error: "Internal error." }));
          }
        }
      });
    },
  };
}
