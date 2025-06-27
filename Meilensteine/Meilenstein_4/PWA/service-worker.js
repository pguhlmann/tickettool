const VERSION = "v2";

const CACHE_NAME = `Ticketscanner-${VERSION}`;

const APP_STATIC_RESOURCES = [
	"/",
	"/index.html",
	"/app.js",
	"/icon.png",
];

/**
 * Currently only caches predefined static resources. (--> install event)
 * Deletes old service workers and updates all pages. (--> actiavte event)
 * Checks the requests cache property, if "no-store": skip all caching, fetch straight from network.
 * Otherwise check if cached, fall back to network.
 * *Should* not add new resources to cache. Might want to implement that later for bootstrap etc.
 */

self.addEventListener("install", (e) => {
	e.waitUntil((async () => {
		const cache = await caches.open(CACHE_NAME);
		cache.addAll(APP_STATIC_RESOURCES);
	})()
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			const names = await caches.keys(); // get all caches
			await Promise.all(
				names.map((name) => {
					if (name !== CACHE_NAME) {
						return caches.delete(name); // delete old caches -> version number contained in name
					}
				}),
			);
			await clients.claim(); // ALL YOUR CLIENT ARE BELONG TO US
		})(),
	);
});

self.addEventListener("fetch", (event) => {
	// check if we're contacting the API -> cache: no-store
	if (event.request.cache === "no-store") {
		// ignore cache, always use network
		event.respondWith(fetch(event.request));
	}

	// For every other request
	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			const cachedResponse = await cache.match(event.request);
			if (cachedResponse) {
				// Return the cached response if it's available.
				return cachedResponse;
			}
			return fetch(event.request); // Otherwise, fall back to network.
		})(),
	);
});