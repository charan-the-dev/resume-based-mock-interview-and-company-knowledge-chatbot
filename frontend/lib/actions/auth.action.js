"use server";

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const SESSION_DURATION_IN_SECONDS = 60 * 60 * 24 * 7;

const setSesstionToken = async (idToken) => {
    const cookieStore = await cookies();

    // create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION_IN_SECONDS * 1000, // in milliseconds
    });

    // set cookie in browser
    cookieStore.set("session", sessionCookie, {
        maxAge: SESSION_DURATION_IN_SECONDS,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    })
}

export async function signup(params) {
    const { uid, email, password } = params;

    try {
        // check if the user already exists 
        const user = await db.collection("users").doc(uid).get();
        if (user.exists) {
            return {
                success: false,
                message: "The user already exists. Please sign in !"
            }
        }

        // add new user to the database
        await db.collection("users").doc(uid).set({
            email,
            password
        });

        return {
            success: true,
            message: "A new User is created. Please sign in to continue"
        }

    } catch (e) {
        console.log("Error creating a user!", e);
        if (e.code === "auth/email-already-in-use") {
            return {
                success: false,
                message: "This email already exists",
            }
        }

        return {
            success: false,
            message: "Failed to create an account",
        }
    }
}

export async function login(params) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        // check if the user exists
        if (!userRecord) {
            console.log("There is no user with the email");
            return {
                success: false,
                message: "There is no user with the given email. Please, Sign up first!"
            }
        }

        await setSesstionToken(idToken);
        return {
            success: true,
            message: "User logged in sussessfully"
        }

    } catch (e) {
        console.log("There was an error loggin in", e);

        return {
            success: false,
            message: "Failed to log in to your account. Please try again!"
        }
    }
}

export const getCurrentUser = async () => {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    
    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection("users").doc(decodedClaims.uid).get();

        if (!userRecord)
            return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        }
    } catch (e) {
        console.log("There was some error while getting current user", e);
    }
}

export const isAuthenticated = async () => {
    const user = await getCurrentUser();
    return !!user; 
}

export async function signout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}