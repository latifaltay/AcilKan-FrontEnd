import { isAxiosError } from "axios";

/** Axios hatasından backend'in döndürdüğü kullanıcı dostu mesajı çıkarır. */
export function getApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 429) {
      return "Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.";
    }
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
  }
  return fallback;
}

/** Hatanın 401 Unauthorized olup olmadığını kontrol eder. */
export function isUnauthorizedError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 401;
}
