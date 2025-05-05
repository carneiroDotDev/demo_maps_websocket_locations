const CACHE_NAME = "machine-monitor-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// There was an error with the scheme of URLs being cached
// Helper function to check if valid url
function isValidScheme(url) {
  const validSchemes = ["http:", "https:"];
  try {
    const urlScheme = new URL(url).protocol;
    return validSchemes.includes(urlScheme);
  } catch {
    return false;
  }
}

// Fetch event - network first, then cache
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests, WebSocket connections, and invalid schemes
  if (
    event.request.method !== "GET" ||
    event.request.url.includes("ws://") ||
    event.request.url.includes("wss://") ||
    !isValidScheme(event.request.url)
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache if response is valid
        // had an error regarding caching chrome-extension urls
        if (response.ok) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        // Trying to hit cache
        return caches.match(event.request);
      })
  );
});
