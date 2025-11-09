"use server";

import { db } from "@/firebase/admin";

export async function doesInterviewExist(id) {
    if (!id) {
        console.log("Invalid interview ID:", id);
        return { success: false, interview: null };
    }

    try {
        const doc = await db.collection("interviews").doc(id || "").get();
        if (doc.exists) {
            return {
                success: true,
                interview: doc.data()
            }
        }
    } catch (e) {
        console.log("Error checking interview existence:", e);
        return {
            success: false,
            interview: null
        };
    }
}

export async function createInterview(interviewParams) {
    try {
        const { type, difficulty, experience, techStack, noOfQuestions, questions, userId } = interviewParams;

        if (!userId) {
            return {
                success: false,
                interviewId: null,
                message: "There was an error creating interview. Invalid userId!"
            }
        }

        const interviewRef = db.collection("interviews").doc();
        const interviewId = interviewRef.id;

        const newQuestions = questions.map(q => {
            const randomId = crypto.randomUUID();
            return {...q, id: randomId};
        })

        await interviewRef.set({
            userId,
            type,
            difficulty,
            experience,
            techStack,
            noOfQuestions,
            questions: newQuestions,
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

export async function getInterviewById(id) {
    if (!id) {
        return {
            success: false,
            interview: null,
            message: "The Interview Id is null"
        }
    }

    try {
        const interview = await db.collection("interviewa").doc(id).get();
        console.log(interview.data());

        return {
            success: true,
            interview: interview,
            message: "The interview is fetched"
        }
    } catch (e) {
        console.log("There was an error fetching interview with id: ", id, e);
        return {
            success: false,
            message: `There was an error fetching interview with id: ${id}`,
            interview: null
        }
    }
}


export async function getQuestions(interviewId) {
    if (!interviewId) {
        return {
            ok: false,
            questions: null,
            message: "Invalid Interview ID"
        }
    }

    try {
        const interview = await db.collection("interviews").doc(interviewId).get();
        if (interview.exists && interview.data().questions) {
            return {
                ok: true,
                questions: interview.data().questions,
                message: "Questions are successfully fetched"
            }
        }
    } catch (e) {
        console.log("There was an error fetching the question with id: ", id, e);
        return {
            ok: false,
            message: `There was an error fetching the question with id: ${id}`,
            questions: null
        }
    }
}