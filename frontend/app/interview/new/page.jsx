"use client";

import { useState } from "react";
import Toast from "@/components/Toast";
import { generateQuestions } from "@/lib/actions/llm";
import { createInterview } from "@/lib/actions/interview.action";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";

const MIN_QUESTIONS = 2;

export default function InterviewForm() {

    const router = useRouter();

    const [difficulty, setDifficulty] = useState("");
    const [type, setType] = useState("");
    const [experience, setExperience] = useState("");
    const [techInput, setTechInput] = useState("");
    const [techStack, setTechStack] = useState([]);
    const [noOfQuestions, setNoOfQuestions] = useState("");
    const [message, setMessage] = useState({ text: "", type: "warning" });
    const [loading, setLoading] = useState(false);

    const handleAddTech = () => {
        const tech = techInput.trim();
        if (tech && !techStack.includes(tech)) {
            setTechStack([...techStack, tech]);
            setTechInput("");
        }
    };

    const handleRemoveTech = (tech) => {
        setTechStack(techStack.filter((t) => t !== tech));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        if (loading) return; // prevent double click
        setMessage({ text: "", type: "warning" });
        setLoading(true);

        try {
            if (!difficulty || !type || !experience) {
                throw new Error("Please fill all required fields.");
            }

            if (techStack.length === 0) {
                throw new Error("Please add at least one tech stack.");
            }

            if (isNaN(Number(noOfQuestions)) || Number(noOfQuestions) < MIN_QUESTIONS) {
                throw new Error(`Number of questions should be at least ${MIN_QUESTIONS}.`);
            }

            const user = await getCurrentUser();
            const userId = user?.id || null;

            const interviewFormData = {
                userId,
                difficulty,
                type,
                experience,
                techStack,
                noOfQuestions: Number(noOfQuestions),
            };

            try {   
                const LLMRes = await generateQuestions(interviewFormData);
                if (!LLMRes?.success || !LLMRes?.questions) {
                    console.log(LLMRes.message);
                }
                
                const res = await createInterview({
                    ...interviewFormData,
                    questions: LLMRes.questions,
                });
                
                if (!res?.success) {
                    console.log(LLMRes.message);
                }
    
                setMessage({ text: res.message, type: "success" });
                console.log(res.message);
    
                router.push(`/interview/studio/${res.interviewId}`);
            } catch (e) {
                console.log(e);
            }


        } catch (error) {
            setMessage({ text: error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full h-screen">
            <form className="max-w-lg shadow-2xl mt-5 bg-white/10 mx-auto p-12 rounded-2xl space-y-6">
                <h2 className="text-2xl font-semibold text-center">Interview Details</h2>

                {/* Difficulty */}
                <div>
                    <label className="block mb-2 font-medium">Difficulty</label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full p-2 border-b-2 border-neutral-500/20 focus:outline-none"
                    >
                        <option value="">Select Difficulty</option>
                        {["easy", "intermediate", "pro", "mixed"].map((d) => (
                            <option key={d} value={d}>
                                {d.charAt(0).toUpperCase() + d.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Type */}
                <div>
                    <label className="block mb-2 font-medium">Interview Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-2 border-b-2 border-neutral-500/20 focus:outline-none"
                    >
                        <option value="">Select Type</option>
                        {["technical", "behavioral", "both"].map((t) => (
                            <option key={t} value={t}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Experience */}
                <div>
                    <label className="block mb-2 font-medium">Experience Level</label>
                    <input
                        type="text"
                        placeholder="e.g., 2 years, Fresher, Senior Developer..."
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full p-2 border-b-2 border-neutral-500/20 focus:outline-none"
                    />
                </div>

                {/* Tech Stack */}
                <div>
                    <label className="block mb-2 font-medium">Tech Stack / Topic</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Add a tech (e.g., React)"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddTech();
                                }
                            }}
                            className="flex-1 p-2 border-b-2 border-neutral-500/20 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleAddTech}
                            className="px-4 py-2 rounded-lg bg-orange-400/40 hover:bg-orange-700/40 transition"
                        >
                            Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {techStack.map((tech) => (
                            <div
                                key={tech}
                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-sm"
                            >
                                <span>{tech}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTech(tech)}
                                    className="text-red-400 hover:text-red-500"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Number of Questions */}
                <div>
                    <label className="block mb-2 font-medium">Number of Questions</label>
                    <input
                        type="number"
                        placeholder={`Minimum ${MIN_QUESTIONS}`}
                        value={noOfQuestions}
                        onChange={(e) => setNoOfQuestions(e.target.value)}
                        className="w-full p-2 border-b-2 border-neutral-500/20 focus:outline-none appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
              [&::-webkit-outer-spin-button]:appearance-none"
                    />
                </div>

                {/* Toast */}
                {message.text && (
                    <Toast type={message.type} message={message.text} setMessage={setMessage} />
                )}

                {/* Buttons */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        className="w-full py-2 rounded-lg bg-black/60 hover:bg-black transition-colors duration-500 disabled:opacity-50"
                        disabled={loading}
                        onClick={(e) => handleClick(e)}
                    >
                        Take later
                    </button>
                    <button
                        type="button"
                        className="w-full py-2 rounded-lg bg-black/60 hover:bg-black transition-colors duration-500 disabled:opacity-50"
                        disabled={loading}
                        onClick={(e) => handleClick(e)}
                    >
                        Take now
                    </button>
                </div>
            </form>
        </main>
    );
}
