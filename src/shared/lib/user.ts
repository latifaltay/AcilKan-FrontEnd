/**
 * Bir ad(-soyad) metninden avatar için baş harfleri üretir.
 * Örn: "Ayşe Yılmaz" -> "AY", "Mehmet" -> "M"
 */
export const getInitials = (fullName?: string | null, fallback = "?"): string => {
  if (!fullName) return fallback;

  const initials = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || fallback;
};
