"use server";

import { db } from "@/firebase/admin";
import { analyzeAnswers, generateQuestions } from "./llm";

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
            return { ...q, id: randomId };
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
        console.log("There was an error fetching the question with id: ", interviewId, e);
        return {
            ok: false,
            message: `There was an error fetching the question with id: ${interviewId}`,
            questions: null
        }
    }
}

async function analyzeAndStore(interviewId) {
    try {
        // Fetch interview data
        const interviewDoc = await db.collection("interviews").doc(interviewId).get();
        if (!interviewDoc.exists) {
            throw new Error(`Interview with ID ${interviewId} not found`);
        }

        const interviewData = interviewDoc.data();

        // Analyze answers
        const analysis = await analyzeAnswers(interviewData);

        // Generate a unique analysis ID
        const analysisId = interviewId;

        // Store the analysis in the backend (e.g., under "analyses" collection)
        await db.collection("analysis").doc(analysisId).set({
            id: analysisId,
            interviewId,
            createdAt: new Date().toISOString(),
            analysis,
        });

        console.log("Analysis stored successfully:", analysisId);
        return { ok: true, analysisId };
    } catch (error) {
        console.error("❌ Error analyzing or storing interview:", error);
        return { ok: false, error: error.message };
    }
}


export async function saveAnswers(interviewId, answers) {
    if (answers.length === 0) {
        return {
            ok: true,
            message: "Interview saved with empty",
        }
    }

    if (!interviewId)
        return {
            ok: false,
            message: "Invalid Interview ID"
        }

    try {
        const interviewRef = db.collection("interviews").doc(interviewId);
        const interviewSnap = await interviewRef.get();

        if (!interviewSnap.exists) {
            return {
                ok: false,
                message: `Interview with ID ${interviewId} not found`
            };
        }

        await interviewRef.update({ answers });
        analyzeAndStore(interviewId);

        return {
            ok: true,
            message: "Answers saved successfully"
        };
    } catch (e) {
        console.log("There was an error saving the answers with id: ", interviewId, e);
        return {
            ok: false,
            message: `There was an error saving the answers with id: ${id}`,
            questions: null
        }
    }
}

export async function getAnalysis(analysisId) {
    if (!analysisId) {
        return {
            ok: false,
            message: "Invalid Interview ID",
            analysis: null
        };
    }

    try {
        const analysis = await db.collection("analysis").doc(analysisId).get();


        if (!analysis.exists) {
            return {
                ok: false,
                message: `No analysis found for interview ID: ${analysisId}`,
                analysis: null
            };
        }

        return {
            ok: true,
            message: "Analysis fetched successfully",
            analysis: analysis.data()
        };
    } catch (e) {
        console.error("Error fetching analysis for interview ID:", analysisId, e);
        return {
            ok: false,
            message: `There was an error fetching the analysis for interview ID: ${analysisId}`,
            analysis: null
        };
    }
}
