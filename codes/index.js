// function abc(){
//     console.log("navigator",navigator);
// }
// abc()

//Register the service worker 
if("serviceWorker" in navigator){
    window.addEventListener('load',function(){
        navigator.serviceWorker.register("service-worker.js").then((registration)=>{
            console.log('Service Worker Registered Successfully ')
            // if (registration.waiting) {
            //     registration.waiting.postMessage({ action: 'skipWaiting' });
            // }
    
        })
    })
}
// if ('Notification' in window && 'serviceWorker' in navigator) {
//     Notification.requestPermission().then(permission => {
//       if (permission === 'granted') {
//         console.log('Notification permission granted.');
//       } else {
//         console.log('Notification permission denied.');
//       }
//     });
//   }

// Service Worker

// Registration 
//Installation
//Activation
//Running -> Fetch / Sync / Push Notification 