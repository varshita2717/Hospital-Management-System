/**
 * Formats any date string (ISO, YYYY-MM-DD, etc.) to a readable format.
 * Example output: "19 May 2026"
 */
export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
