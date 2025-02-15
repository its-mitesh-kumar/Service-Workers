// On Feedback submit
document
  .getElementById("feedbackForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const feedback = document.getElementById("feedback").value;
    const feedbackData = { feedback, timestamp: new Date().toISOString() };

    if ("serviceWorker" in navigator && "SyncManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;

        if (navigator.onLine) {
          // If online, send feedback immediately
          console.log("Sending feedback directly to the server.");
          // sendFeedback(feedbackData);
        } else {
          // If offline, save data in IndexedDB and register the sync event
          console.log("You are offline! Saving feedback for sync.");
          await saveToIndexedDB(feedbackData);
          await registration.sync.register("sync-feedback"); // Register sync event when offline
          console.log("sync-feedback registered successfully ");
          alert("Your feedback will be sent when online.");
        }
      } catch (error) {
        console.error("Sync registration failed", error);
        alert("Something went wrong. Please try again.");
      }
    } else {
      // Fallback: Just log if SyncManager is not supported
      console.log("SyncManager not supported. Saving data directly.");
    }
  });

// Function to save data to IndexedDB
async function saveToIndexedDB(data) {
  const db = await openDB();
  const transaction = db.transaction("feedbackStore", "readwrite");
  const store = transaction.objectStore("feedbackStore");
  store.put(data);
}

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

async function syncFeedback() {
  const feedbackItems = await getFromIndexedDB();

  feedbackItems.forEach((item) => {
    console.log("Synced Feedback:", item); // Log to simulate sending data

    // Here you could delete the data if you want after sync:
    deleteFromIndexedDB(item.timestamp);
  });
}
