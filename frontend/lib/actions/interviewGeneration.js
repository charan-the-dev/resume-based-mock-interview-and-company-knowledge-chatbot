"use server";

import { generateInterviewPrompt } from "@/prompts/interview_generation";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function generateQuestions(interviewParams) {
    const prompt = generateInterviewPrompt(interviewParams);

    try {
        const { text } = await generateText({
            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
            model: google("gemini-2.0-flash-001"),
            prompt: prompt,
        });

        const cleanedText = text
            .replace(/```json|```/g, "")  // remove code fences
            .replace(/[\u201C\u201D]/g, '"') // replace smart quotes
            .replace(/[\u2018\u2019]/g, "'") // replace smart apostrophes
            .trim();

        return {
            success: true,
            questions: JSON.parse(cleanedText)
        };
    } catch (e) {
        console.log("There was an error generating questions", e);
        return {
            success: false,
            questions: []
        };
    }
}