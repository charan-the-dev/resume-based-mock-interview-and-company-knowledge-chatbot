import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "session_token";

// Helper to ensure secret exists
function getSecret() {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return new TextEncoder().encode(process.env.JWT_SECRET);
}

// Set session (server-side; call from API routes)
export async function setSession(data) {
    try {
        const secret = getSecret();

        // Keep token lifetime and cookie maxAge consistent (24 hours)
        const jwt = await new SignJWT({ ...data })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(secret);

        cookies().set({
            name: COOKIE_NAME,
            value: jwt,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours in seconds
            path: "/",
        });

        return jwt;
    } catch (err) {
        console.error("setSession error:", err);
        throw err;
    }
}

// Get session (server-side). Optionally pass a token string (useful for tests)
export async function getSession(token) {
    try {
        // Try token param, otherwise read cookie
        if (!token) {
            token = cookies().get(COOKIE_NAME)?.value;
        }
        if (!token) return null;

        const secret = getSecret();
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        // invalid/expired token -> return null
        return null;
    }
}

// Delete session
export function deleteSession() {
    cookies().delete(COOKIE_NAME);
    return null;
}
