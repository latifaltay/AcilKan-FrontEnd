import { isAxiosError } from "axios";

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

/** ASP.NET ProblemDetails `errors` alanından düz metin çıkarır. */
function fromProblemDetailsErrors(errors: unknown): string | null {
  if (!errors || typeof errors !== "object") return null;

  const messages: string[] = [];
  for (const value of Object.values(errors as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string" && item.trim()) messages.push(item.trim());
      }
    } else if (typeof value === "string" && value.trim()) {
      messages.push(value.trim());
    }
  }

  return messages.length > 0 ? messages.join(" ") : null;
}

/** Axios / SignalR / genel Error'dan kullanıcıya gösterilecek mesajı çıkarır. */
export function getApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 429) {
      return "Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.";
    }

    const data = error.response?.data as Record<string, unknown> | undefined;
    if (data) {
      const fromEnvelope = firstString(data.message, data.Message);
      if (fromEnvelope) return fromEnvelope;

      const fromTitle = firstString(data.title, data.Title);
      const fromErrors = fromProblemDetailsErrors(data.errors ?? data.Errors);
      if (fromErrors) return fromErrors;
      if (fromTitle) return fromTitle;
    }

    if (error.message && !error.message.startsWith("Request failed")) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    const hubMessage = firstString(error.message);
    if (hubMessage && hubMessage !== "Error") return hubMessage;
  }

  return fallback;
}

/** Hatanın 401 Unauthorized olup olmadığını kontrol eder. */
export function isUnauthorizedError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 401;
}
