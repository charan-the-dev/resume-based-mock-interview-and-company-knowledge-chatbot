"use server";

import { db } from "@/firebase/admin";

export async function doesInterviewExist(id) {
    try {
        const doc = await db.collection("interviews").doc(id).get();
        if (doc.exists) {
            return {
                success: true,
                interview: doc.data()
            }
        }
    } catch (e) {
        console.error("Error checking interview existence:", e);
        return {
            success: false,
            interview: null
        };
    }
}

export async function createInterview(interviewParams) {
    try {
        const { type, difficulty, experience, techStack, noOfQuestions, questions } = interviewParams;

        const interviewRef = db.collection("interviews").doc();
        const interviewId = interviewRef.id;

        await interviewRef.set({
            type,
            difficulty,
            experience,
            techStack,
            noOfQuestions,
            questions,
            createdAt: new Date()
        });

        console.log("A new Interview is created with the Id: ", interviewId);

        return {
            success: true,
            interviewId,
            message: `A new interview is created with the Interview Id: ${interviewId}`
        };

    } catch (e) {
        console.e("Error creating interview:", e);
        return {
            success: false,
            interviewId: null,
            message: "There was an error while generating the Interview. Please try again later"
        }
    }
}

export async function getAllInterviews() {
    try {
        const snapshot = await db.collection("interviews").get();
        const interviews = snapshot.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate
                    ? data.createdAt.toDate().toISOString() // ✅ convert to plain string
                    : null,
            };
        });

        return {
            success: true,
            interviews,
        };
    } catch (e) {
        console.error("There was an error fetching all the interviews:", e);
        return {
            success: false,
            interviews: []
        };
    }
}

