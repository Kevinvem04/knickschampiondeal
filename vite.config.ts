// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { existsSync, readFileSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { join, normalize } from "node:path";
import type { Plugin } from "vite";

async function waitForFile(filePath: string, timeoutMs = 5000): Promise<boolean> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (existsSync(filePath)) return true;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return existsSync(filePath);
}

function serveStaleOptimizedDeps(): Plugin {
  return {
    name: "serve-stale-optimized-deps",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: (error?: unknown) => void) => {
        if (!req.url || (req.method !== "GET" && req.method !== "HEAD")) return next();

        const url = new URL(req.url, "http://localhost");
        if (!url.pathname.startsWith("/node_modules/.vite/deps/") || !url.searchParams.has("v")) return next();

        const depsDir = normalize(join(process.cwd(), "node_modules/.vite/deps"));
        const filePath = normalize(join(process.cwd(), url.pathname.slice(1)));
        if (!filePath.startsWith(depsDir)) return next();

        void waitForFile(filePath)
          .then((fileExists) => {
            if (!fileExists) return next();

            const contentType = filePath.endsWith(".map")
              ? "application/json; charset=utf-8"
              : filePath.endsWith(".css")
                ? "text/css; charset=utf-8"
                : "text/javascript; charset=utf-8";

            res.statusCode = 200;
            res.setHeader("content-type", contentType);
            res.setHeader("cache-control", "no-store");
            if (req.method === "HEAD") return res.end();
            res.end(readFileSync(filePath));
          })
          .catch(next);
      });
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [serveStaleOptimizedDeps()],
    optimizeDeps: {
      include: [
        "react",
        "react/jsx-dev-runtime",
        "react-dom/client",
        "@tanstack/react-query",
        "@tanstack/react-router",
        "@tanstack/router-core",
        "@tanstack/router-core/ssr/client",
        "@supabase/supabase-js",
        "@stripe/react-stripe-js",
        "@stripe/stripe-js",
        "seroval",
      ],
    },
  },
});
