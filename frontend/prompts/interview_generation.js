export function generateInterviewPrompt(interviewParams) {
    const { type, difficulty, experience, techStack, noOfQuestions } = interviewParams;
    return `
        You are an expert AI specialized in generating realistic and well-structured interview questions.

        Generate exactly **${noOfQuestions}** unique interview questions based on the following details.

        ---
        ### PARAMETERS
        - **Type:** ${type}   (Options: "technical", "behavioral", "both")
        - **Difficulty:** ${difficulty}   (Options: "easy", "intermediate", "pro", "mixed")
        - **Experience Level:** ${experience}   (Example: "Fresher", "2 years in backend development", "Senior full-stack engineer")
        - **Tech Stack / Skills:** ${Array.isArray(techStack) ? techStack.join(", ") : techStack}
        - **Number of Questions:** ${noOfQuestions}
        ---

        ### EXPECTATIONS
        1. If **type = "technical"**, generate only technical questions.
        2. If **type = "behavioral"**, generate only behavioral questions.
        3. If **type = "both"**, generate a balanced mix of both — but only the **technical questions** should include MCQs.
        4. For **technical questions**:
        - Include a mix of **open-ended (text)** and **multiple-choice questions (MCQs)**.
        - Among MCQs, include both (but if the **difficulty = "pro"**, only use mulitple choice and multiple correct type questions) :
            - **Single-correct MCQs** — where only one option is correct.
            - **Multiple-correct MCQs** — where more than one option is correct.
        5. For **behavioral questions**:
        - Always use **text** format.
        6. The **difficulty** should reflect the parameter (or be mixed when specified).
        7. Tailor every question to the candidate’s **experience level** and **tech stack**.
        8. Ensure all questions are **unique**, **clear**, and **practically relevant**.

        ---

        ### OUTPUT FORMAT
        Return only a **valid JSON array** (no text, markdown, or explanations).

        Each question object must follow this exact schema:

        \`\`\`json
        [
            {
                "question": "string — the interview question text",
                "type": "technical | behavioral",
                "format": "text | mcq-single | mcq-multiple",
                "difficulty": "easy | intermediate | pro",
                "relatedSkill": "string — main skill or topic (e.g., React, Communication, Algorithms)",
                "options": ["array of choices — only if format starts with 'mcq'"]
            }
        ]
        \`\`\`

        ### ADDITIONAL RULES
        - Output must be **valid JSON**, directly parsable with \`JSON.parse()\` and do not add anything extra not even a single letter. Generate interview questions in the following JSON format only.
            Do not include any markdown, code blocks, or text outside the JSON.
            Format:
            [
                {
                    "question": "...",
                    "type": "...",
                    ...
                }
            ]
        - Include exactly **${noOfQuestions}** questions.
        - Use **MCQs only for technical** questions (or the technical portion of 'both').
        - Mix **mcq-single** and **mcq-multiple** naturally for variety.
        - **Do not include any answers or explanations**.

        Now, generate the questions accordingly.
    `;
}