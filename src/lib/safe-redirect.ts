const DEFAULT_REDIRECT = "/"

/**
 * Returns a safe, same-origin relative redirect path.
 * Rejects absolute URLs (https://example.com), protocol-relative URLs
 * (//example.com), backslash tricks, and control characters. Falls back to "/".
 */
export function getSafeRedirectPath(
  value: string | null | undefined,
  fallback: string = DEFAULT_REDIRECT
): string {
  if (!value) {
    return fallback
  }

  // Must be a site-relative path.
  if (!value.startsWith("/")) {
    return fallback
  }

  // Reject protocol-relative ("//host") and backslash variants ("/\host", "\\").
  if (value.startsWith("//") || value.includes("\\")) {
    return fallback
  }

  // Reject control characters and whitespace.
  if (/[\u0000-\u001f\u007f\s]/.test(value)) {
    return fallback
  }

  return value
}

/** Reads the `redirect` query param from the current URL and sanitizes it. */
export function getRedirectFromLocation(
  fallback: string = DEFAULT_REDIRECT
): string {
  if (typeof window === "undefined") {
    return fallback
  }

  const value = new URLSearchParams(window.location.search).get("redirect")
  return getSafeRedirectPath(value, fallback)
}