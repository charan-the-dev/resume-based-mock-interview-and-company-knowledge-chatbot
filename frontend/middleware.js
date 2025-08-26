import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "session_token";

export default async function middleware(req) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const { pathname } = req.nextUrl;

    if (!token) {
        NextResponse.redirect(new URL("/auth/login", req.url));
    }

    NextResponse.redirect(new URL("/auth/signup", req.url));
}

export const config = {
    matcher: ["/auth/login", "/auth/signup"]
};
