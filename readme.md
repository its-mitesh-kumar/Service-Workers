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

## Service Worker LifecycleService Worker Lifecycle
The Service Worker Lifecycle has three main phases:
1. Registration
2. Installation (install event)
3. Activation (activate event)
4. Running (fetch event,push, sync)

### 1. Registration
Before the lifecycle starts, we need to register the Service Worker in our webpage.
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Service Worker registered:', reg))
    .catch(err => console.error('Service Worker registration failed:', err));
}

```

