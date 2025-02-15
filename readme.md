# 𝗨𝗻𝗹𝗲𝗮𝘀𝗵𝗶𝗻𝗴 𝘁𝗵𝗲 𝗦𝘂𝗽𝗲𝗿𝗣𝗼𝘄𝗲𝗿𝘀 𝗼𝗳 𝗦𝗲𝗿𝘃𝗶𝗰𝗲 𝗪𝗼𝗿𝗸𝗲𝗿𝘀: 𝗛𝗼𝘄 𝗦𝗹𝗮𝗰𝗸 𝗖𝘂𝘁 𝗕𝗼𝗼𝘁 𝗧𝗶𝗺𝗲 𝗯𝘆 𝟱𝟬%

Firstly Let's understand what is Service Worker

## What is a Service Worker?
A Service Worker is a JavaScript script that runs in the background, separate from the main browser thread. It enables features like:
- Background sync
- Push notifications
- Caching assets for offline access
- No DOM access 
- Run on a different thread to the main JavaScript
- Designed to be fully asynchronous 
-  As a consequence, APIs such as synchronous XHR and Web Storage can't be used inside a service worker
- Service workers only run over HTTPS

## Service Worker Lifecycle
The Service Worker Lifecycle has three main phases:
2. Installation (install event)
3. Activation (activate event)
4. Running (fetch event,push, sync)

### Step 1: Registering a Service Worker
Before the lifecycle starts, we need to register the Service Worker in our webpage.
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Service Worker registered:', reg))
    .catch(err => console.error('Service Worker registration failed:', err));
}

```
### Phase 1: Installation (install event)
In this phase the service worker is downloaded and installed.This happens when the browser downloads the service worker for the first time or if the file has changed.
Common tasks:
Cache static assets (HTML, CSS, JS, images)
Prepare the service worker for activation
Example: install event
```
self.addEventListener('install', event => {
  console.log('Service Worker Installing...');
  event.waitUntil(
    caches.open('static-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/script.js',
        '/logo.png'
      ]);
    })
  );
});

```
🔹 **What's happening?**
- The install event fires when the service worker is installed.
- We open a cache storage (static-v1) and store important files.

### Phase 2: Activation (activate event)Phase 2: Activation (activate event)
This happens after installation. Here, we:
- **Delete old caches** (if any)
- **Start controlling pages immediately**

Example: activate event
```
self.addEventListener('activate', event => {
  console.log('Service Worker Activated!');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== 'static-v1') {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

```
🔹 **What’s happening?**
- We check all existing caches.
- If the cache name does not match static-v1, we delete it.

### Phase 3: Running
Now the service worker is active and can handles events like fetch, sync, and push.
🔹 In the Running phase, events happen:
- **fetch **→ Intercepts network requests for caching & offline support.
- **sync** → Handles background sync when the network is restored.
- **push** → Listens for push notifications from the server.

#### Fetch event
If the service worker is running it can intercept network requests to serve cached files.
**Example: Handling Fetch Requests**
```
self.addEventListener('fetch', event => {
  console.log('Fetching:', event.request.url);

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```
🔹 **What’s happening?**
- The service worker listens for network requests.
- If the request is in the cache, it returns the cached version.
- Otherwise, it fetches it from the network.

#### Background Sync (sync event)
If a network request fails (e.g., due to no internet), we can retry it later when the internet is back. Let's consider a user fill complete details on a feedback form and he lost internet , we will not like user to re-enter all the details to be entered again . Then how we can handle it . Answer is ** sync** event of service worker 

```
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncDataFunction());
  }
});

function syncDataFunction() {
  console.log('Syncing data in the background...');
  return fetch('/sync-endpoint', { method: 'POST' });
}

```
#### Push Notifications (push event)
The server can send a push notification using **Web Push Protocol** . If a push notification is received from the server show it to user .

```
self.addEventListener('push', event => {
  console.log('Push Notification Received:', event.data.text());

  const options = {
    body: event.data.text(),
    icon: '/logo.png',
    badge: '/badge.png'
  };

  event.waitUntil(
    self.registration.showNotification('New Notification', options)
  );
});
```





















