import type { FirebaseApp } from "firebase/app";
import { FIREBASE_CONFIG, FIREBASE_VAPID_KEY } from "./env";

// Bundle boyutunu şişirmemek için Firebase modülleri sadece kullanıldıklarında
// (telefon doğrulama / push izni) dinamik olarak yüklenir.
let appPromise: Promise<FirebaseApp> | null = null;

async function getFirebaseApp(): Promise<FirebaseApp> {
  if (!appPromise) {
    appPromise = import("firebase/app").then(({ initializeApp, getApps, getApp }) =>
      getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG)
    );
  }
  return appPromise;
}

/** Firebase Phone Auth için Auth örneği döner (dinamik import). */
export async function getFirebaseAuth() {
  const [{ getAuth }, app] = await Promise.all([
    import("firebase/auth"),
    getFirebaseApp(),
  ]);
  return getAuth(app);
}

/** Firebase Auth ile ilgili sınıfları (RecaptchaVerifier, signInWithPhoneNumber) dinamik yükler. */
export async function getFirebaseAuthModule() {
  return import("firebase/auth");
}

/**
 * Tarayıcıdan bildirim izni ister, service worker'ı kaydeder ve bir FCM
 * registration token döner. İzin verilmezse veya desteklenmiyorsa `null` döner.
 */
export async function getFcmToken(): Promise<string | null> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }
  if (!("serviceWorker" in navigator)) {
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return null;
  }

  try {
    const [{ getMessaging, getToken }, app, registration] = await Promise.all([
      import("firebase/messaging"),
      getFirebaseApp(),
      navigator.serviceWorker.register("/firebase-messaging-sw.js"),
    ]);

    const messaging = getMessaging(app);
    return await getToken(messaging, {
      vapidKey: FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
  } catch (error) {
    console.error("FCM token alınamadı:", error);
    return null;
  }
}

/** Uygulama ön plandayken gelen push mesajlarını dinler. */
export async function onForegroundMessage(
  callback: (payload: unknown) => void
): Promise<() => void> {
  const [{ getMessaging, onMessage }, app] = await Promise.all([
    import("firebase/messaging"),
    getFirebaseApp(),
  ]);
  const messaging = getMessaging(app);
  return onMessage(messaging, callback);
}
