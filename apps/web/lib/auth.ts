export function getUserIdFromRequest(req: Request): string | null {
  const h = (req.headers.get("x-user-id") || "").trim();
  return h || null;
}
