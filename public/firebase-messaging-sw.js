'use strict'

importScripts('https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.4/firebase-messaging.js')

const process = {
    env: {
        FIREBASE_API_KEY: '',
        FIREBASE_AUTH_DOMAIN: '',
        FIREBASE_PROJECT_ID: '',
        FIREBASE_STORAGE_BUCKET: '',
        FIREBASE_MESSAGINGSENDERID: '',
        FIREBASE_APP_ID: '',
        FIREBASE_MEASUREMENT_ID: '',
        FIREBASE_VAPID_KEY: ''
    }
};

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
}

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

messaging.onBackgroundMessage(payload => {
    const notificationTitle = payload?.data?.title
    const notificationOptions = {
        body: payload?.data?.body,
        icon: ''
    }
    
    return self.registration.showNotification(notificationTitle, notificationOptions)
})
