"use server";

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK_IN_SECs = 60 * 60 * 24 * 7;
const ONE_DAY_IN_SECs = 60 * 60 * 24;
const ONE_HOUR_IN_SECs = 60 * 60;

const SESSION_DURATION = ONE_HOUR_IN_SECs * 3;

const generateRandomUsername = (email) => {
    const usernameBase = email.split('@')[0];
    const randomSuffix = Math.random().toString(36).slice(2, 8);
    return `${usernameBase}_${randomSuffix}`;
}


const setSesstionToken = async (idToken) => {
    const cookieStore = await cookies();

    // create session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION * 1000, // in milliseconds
    });

    // set cookie in browser
    cookieStore.set("session", sessionCookie, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    })
}

export async function signup(params) {
    const { uid, email, password } = params;

    console.log(uid, email, password);
    

    try {
        // check if the user already exists 
        const user = await db.collection("users").doc(uid).get();
        console.log(user);
        
        if (user.exists) {
            console.log("There is already an existing user!");
            
            return {
                success: false,
                message: "The user already exists. Please sign in !"
            }
        }

        // add new user to the database
        const res = await db.collection("users").doc(uid).set({
            email,
            password,
            username: generateRandomUsername(email),
        });

        console.log(res);
        
        
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

        if (e.code === "auth/invalid-credential") {
            return {
                success: false,
                message: "The entered credentials are incorrect!"
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

export const updateUserDetails = async (userId, updatedDetails) => {
    const user = await db.collection("users").doc(userId).get();
    if (!user.exists) {
        return {
            success: false,
            message: "The user does not exist. Please sign up!"
        }
    }

    await db.collection("users").doc(userId).set(updatedDetails, { merge: true });
    return {
        success: true,
        message: "User details updated successfully"
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