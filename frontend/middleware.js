import { NextResponse } from "next/server";

export async function middleware(request) {
    const session = request.cookies.get("session")?.value;

    // If no session cookie → redirect to login
    if (!session) {
        const url = new URL("/auth/sign-in", request.url);
        return NextResponse.redirect(url);
    }

    // Allow access if verified
    return NextResponse.next();
}

// Define which routes the middleware applies to
export const config = {
    matcher: [
        "/interview/:path*",
        "/dashboard/:path*",
        "/profile/:path*",
    ],
};