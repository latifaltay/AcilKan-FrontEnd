/** JWT payload'ını decode eder (imza doğrulamaz; sadece claim okuma için). */
export function readJwtPayload(
  token: string | null | undefined
): Record<string, unknown> | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Access token içindeki `cityId` claim'ini okur. */
export function readCityIdFromAccessToken(): number | null {
  const payload = readJwtPayload(localStorage.getItem("accessToken"));
  if (!payload) return null;
  const raw = payload.cityId ?? payload.CityId;
  const value = typeof raw === "string" || typeof raw === "number" ? Number(raw) : NaN;
  return Number.isFinite(value) && value > 0 ? value : null;
}
