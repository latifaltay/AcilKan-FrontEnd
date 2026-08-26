const DEFAULT_IDENTITY_API_URL = "https://localhost:7214/api";
const DEFAULT_DONATION_API_URL = "https://localhost:7079/api";

export const IDENTITY_API_URL =
  import.meta.env.VITE_IDENTITY_API_URL || DEFAULT_IDENTITY_API_URL;
export const DONATION_API_URL =
  import.meta.env.VITE_DONATION_API_URL || DEFAULT_DONATION_API_URL;

/** Donation.API üzerindeki SignalR hub'ı — REST'ten farklı bir port/host olabileceğinden ayrı türetilir. */
export const HUB_URL = `${DONATION_API_URL.replace(/\/api\/?$/, "")}/hubs/communication`;

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const FIREBASE_VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

if (import.meta.env.PROD) {
  if (!import.meta.env.VITE_IDENTITY_API_URL || !import.meta.env.VITE_DONATION_API_URL) {
    console.warn(
      "VITE_IDENTITY_API_URL / VITE_DONATION_API_URL tanımlanmamış, varsayılan yerel adresler kullanılıyor. Prod ortamında .env dosyasını yapılandırın."
    );
  }
}
