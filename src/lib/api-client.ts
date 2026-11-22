import { authClient } from "@/lib/auth-client"

/**
 * Client-side API helper for the Rentora Express backend.
 *
 * Better Auth (v1.7.26) exposes a signed JWT at `GET /api/auth/token`, which
 * returns `{ token: "<jwt>" }`. This utility fetches that token, caches it in
 * memory until shortly before it expires, and attaches it to backend requests
 * as `Authorization: Bearer <token>`.
 *
 * Public requests (when there is no session) are sent unchanged, so existing
 * public endpoints keep working exactly as before.
 */

const TOKEN_ENDPOINT = "/token"
const EXPIRY_SAFETY_MARGIN_MS = 30_000
const FALLBACK_TTL_MS = 60_000

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")

type TokenResponse = { token: string }

let cachedToken: { value: string; expiresAt: number } | null = null

function isTokenResponse(value: unknown): value is TokenResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as TokenResponse).token === "string"
  )
}

/** Reads the `exp` claim (in ms) from a JWT payload; no signature check needed. */
function readExpiry(token: string): number {
  try {
    const encodedPayload = token.split(".")[1]
    if (!encodedPayload) return Date.now() + FALLBACK_TTL_MS

    const normalized = encodedPayload.replace(/-/g, "+").replace(/_/g, "/")
    const payload = JSON.parse(atob(normalized)) as { exp?: unknown }

    return typeof payload.exp === "number"
      ? payload.exp * 1000
      : Date.now() + FALLBACK_TTL_MS
  } catch {
    return Date.now() + FALLBACK_TTL_MS
  }
}

/**
 * Returns a signed JWT for the current Better Auth session, or `null` when the
 * user is not signed in (or the token request fails). Never throws.
 */
export async function getJwt(): Promise<string | null> {
  if (
    cachedToken &&
    cachedToken.expiresAt > Date.now() + EXPIRY_SAFETY_MARGIN_MS
  ) {
    return cachedToken.value
  }

  const { data, error } = await authClient.$fetch(TOKEN_ENDPOINT, {
    method: "GET",
  })

  if (error || !isTokenResponse(data)) {
    cachedToken = null
    return null
  }

  cachedToken = { value: data.token, expiresAt: readExpiry(data.token) }
  return data.token
}

/** Clears the cached JWT (call this on sign-out). */
export function clearJwt() {
  cachedToken = null
}

/**
 * Fetch wrapper for the backend API. Attaches `Authorization: Bearer <token>`
 * when the user is signed in; otherwise sends the request unchanged.
 */
export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured")
  }

  const token = await getJwt()
  const headers = new Headers(init.headers)

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  return fetch(`${apiBaseUrl}${path}`, { ...init, headers })
}