import axios, { type AxiosError, type AxiosInstance } from "axios";
import { IDENTITY_API_URL, DONATION_API_URL } from "../config/env";
import type { ApiSuccess } from "./envelope";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

interface RefreshTokenResult {
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

/** Eşzamanlı 401'lerde tek seferde çalışması için paylaşılan refresh kilidi. */
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("Refresh token bulunamadı");
      }

      const response = await axios.post<ApiSuccess<RefreshTokenResult>>(
        `${IDENTITY_API_URL}/Auth/refresh`,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefreshToken } =
        response.data.data.token;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      return accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function handleRefreshFailure() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

/** Bearer header enjeksiyonu ve paylaşılan 401-refresh mantığına sahip bir Axios istemcisi oluşturur. */
export function createHttpClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const accessToken = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          handleRefreshFailure();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

/** Identity.API — kimlik doğrulama, hesap, şehir/ilçe referans verisi. */
export const identityApi = createHttpClient(IDENTITY_API_URL);

/** Donation.API — kan talebi, bağış, hastane, profil, sohbet, bildirim, cihaz kaydı. */
export const donationApi = createHttpClient(DONATION_API_URL);
