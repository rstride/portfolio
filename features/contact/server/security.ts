import type { NextRequest } from "next/server";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const submissionTracker = new Map<string, number[]>();

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export function isRateLimited(clientKey: string) {
  const now = Date.now();
  const recentAttempts = (submissionTracker.get(clientKey) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recentAttempts.length >= RATE_LIMIT_MAX_REQUESTS) {
    submissionTracker.set(clientKey, recentAttempts);
    return true;
  }

  recentAttempts.push(now);
  submissionTracker.set(clientKey, recentAttempts);
  return false;
}
