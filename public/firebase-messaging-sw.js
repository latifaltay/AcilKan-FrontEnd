// Firebase Cloud Messaging arka plan (background) push bildirim handler'ı.
// Bu dosya bir Service Worker olduğu için Vite/ES modül sistemine dahil değildir;
// public/ altında statik olarak servis edilir ve importScripts ile Firebase'in
// "compat" (klasik script) SDK'sını yükler.
//
// NOT: Buradaki config değerleri Firebase Client SDK config'idir (apiKey dahil) —
// bunlar tarayıcıda zaten açık olan, gizli olmayan genel proje tanımlayıcılarıdır.
// Servis hesabı (service account) private key'i ile karıştırılmamalıdır; o backend'de kalır.
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDs8G_77I6LkWRZQvaBgvKXxHFnbVFpsOg",
  authDomain: "kandostum-54.firebaseapp.com",
  projectId: "kandostum-54",
  storageBucket: "kandostum-54.firebasestorage.app",
  messagingSenderId: "987054230995",
  appId: "1:987054230995:web:cc6e1db11b09b4feb03326",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || "KanDostum";
  const body = payload.notification?.body || payload.data?.body || "";

  self.registration.showNotification(title, {
    body,
    icon: "/favicon.svg",
    data: payload.data,
  });
});
