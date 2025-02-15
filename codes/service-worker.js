var CACHE_NAME = "v1";
var filesTOCache = [
  "index.js",
  "index.html",
  "assests/mitesh.jpeg",
  "style.css",
  "/",
  "index-db-peration.js",
  "offline.html",
];

// Service Worker codes
//==========================

// Install - Cache Important Assets
self.addEventListener("install", (event) => {
  console.log("Installing ");
  self.skipWaiting();
  event
    .waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log("Cache Opened ");
        return cache.addAll(filesTOCache);
      })
    )
    .catch((error) => {
      console.log("Error", error);
    });
});

// Activate event: Cleanup old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Service Worker: Deleting old cache", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Serve files from the cache or fetch from network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((cachedResponse) => {
        console.log("cachedResponse", cachedResponse);

        if (!navigator.onLine) {
          return caches.match("/offline.html"); // Or handle differently
        }

        // If cached response is found, serve it
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch from the network
        return fetch(event.request);
      })
      .catch(() => {
        // If fetch fails (network is unavailable), serve offline.html
        return caches.match("/offline.html");
      })
  );
});

// Push Notification 
self.addEventListener("push", (event) => {
  console.log("event", event);
  console.log(Notification.permission);
  if (Notification.permission !== "granted") {
    console.warn("Notification permission is not granted.");
    return;
  }
  console.log("event.data.text()", event.data.text());
  event.waitUntil(
    self.registration.showNotification("New Notification", {
      body: event.data.text(),
    })
  );
});

// Sync 
self.addEventListener("sync", async (event) => {
  console.log("Sync Event is triggered ");
  if (event.tag === "sync-feedback") {
    console.log("Sync event triggered: Processing stored feedback...");
    event.waitUntil(syncFeedback());
  }
});

self.addEventListener("error", (event) => {
  console.error("Error in Service Worker:", event.message);
});

// ===== Some Utility Function ======================

// Function to open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("feedbackDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("feedbackStore", { keyPath: "timestamp" });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Failed to open IndexedDB");
  });
}
// Function to delete feedback from IndexedDB
async function deleteFromIndexedDB(timestamp) {
  const db = await openDB();
  const transaction = db.transaction("feedbackStore", "readwrite");
  const store = transaction.objectStore("feedbackStore");
  store.delete(timestamp);
}

// Function to retrieve feedback from IndexedDB
async function getFromIndexedDB() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("feedbackStore", "readonly");
    const store = transaction.objectStore("feedbackStore");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Failed to fetch data from IndexedDB");
  });
}

// Function to sync feedback data from IndexedD
async function syncFeedback() {
  const feedbackItems = await getFromIndexedDB();

  feedbackItems.forEach((item) => {
    console.log("Synced Feedback:", item); // Log to simulate sending data

    // Here you could delete the data if you want after sync:
    deleteFromIndexedDB(item.timestamp);
  });
}

// navigator.serviceWorker.getRegistration().then(reg => {
//     if (reg) reg.unregister();
//   });
