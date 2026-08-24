// Serwist service worker source. Compiled to /public/sw.js by @serwist/next.
// Strategy:
//   - precacheAndRoute handles the manifest entries Serwist injects (offline page etc.)
//   - app routes (/dashboard, /pipeline, ...) get a NetworkFirst strategy so the
//     freshest HTML wins on reconnect, with a cached fallback for offline.
//   - /api/* uses StaleWhileRevalidate so reads feel instant, writes still hit the
//     network.
//   - /manifest.json, /icons/* are precached alongside the shell.
import { defaultCache } from "@serwist/next/worker";
import { Serwist, CacheFirst, NetworkFirst, StaleWhileRevalidate } from "serwist";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // App shell + app routes — always try network first, fall back to cache.
    {
      matcher: ({ request, url }) =>
        request.mode === "navigate" &&
        url.origin === self.location.origin,
      handler: new NetworkFirst({
        cacheName: "sponsordesk-app",
        networkTimeoutSeconds: 5,
        plugins: [
          {
            // Keep at most 30 app-shell HTML pages for fast offline return.
            cacheWillUpdate: async ({ response }) =>
              response && response.status === 200 ? response : null,
          },
        ],
      }),
    },
    // API GETs — stale-while-revalidate so the dashboard feels instant when you
    // bounce back into the tab.
    {
      matcher: ({ url, request }) =>
        request.method === "GET" && url.pathname.startsWith("/api/"),
      handler: new StaleWhileRevalidate({ cacheName: "sponsordesk-api" }),
    },
    // Static assets under /icons/, /images/ — cache-first, versioned URLs bust
    // when we ship new icons.
    {
      matcher: ({ url }) =>
        url.pathname.startsWith("/icons/") ||
        url.pathname.startsWith("/images/"),
      handler: new CacheFirst({ cacheName: "sponsordesk-static" }),
    },
    // Default fallbacks from the @serwist/next worker.
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/dashboard",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

serwist.addEventListeners();
