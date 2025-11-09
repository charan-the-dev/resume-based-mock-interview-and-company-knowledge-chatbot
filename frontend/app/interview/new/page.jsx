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
        if (techInput.trim() && !techStack.includes(techInput.trim())) {
            setTechStack([...techStack, techInput.trim()]);
            setTechInput("");
        }
    };

    const handleRemoveTech = (tech) => {
        setTechStack(techStack.filter((t) => t !== tech));
    };

    const handleClick = async (e, takingNow) => {
        e.preventDefault();
        setMessage({ text: "", type: "warning" });

        if (!difficulty || !type || !experience) {
            setLoading(false);
            setMessage({ text: "Please fill all required fields.", type: "error" });
            return;
        }

        if (techStack.length === 0) {
            setLoading(false);
            setMessage({ text: "Please add at least one tech stack.", type: "error" });
            return;
        }

        if (isNaN(Number(noOfQuestions)) || Number(noOfQuestions) < MIN_QUESTIONS) {
            setLoading(false);
            setMessage({ text: `Number of questions should be at least ${MIN_QUESTIONS}.`, type: "error" });
            return;
        }

        const interviewFormData = {
            userId: (await getCurrentUser()).id || null,
            difficulty,
            type,
            experience,
            techStack,
            noOfQuestions: Number(noOfQuestions),
        };

        setLoading(true);

        const LLMRes = await generateQuestions(interviewFormData);

        if (!LLMRes.success || !LLMRes.questions) {
            setLoading(false);
            setMessage({ text: LLMRes.message, type: "error" });
            return;
        }

        const questions = LLMRes?.questions;

        const res = await createInterview({ ...interviewFormData, questions });

        if (!res.success) {
            setMessage({ text: res.message, type: "error" });
            return;
        }


        setMessage({ text: res.message, type: "success" });
        setLoading(false);
        if (takingNow) {
            router.push(`/interview/studio/${res.interviewId}`);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <main className="w-full h-screen">
            <form className="max-w-lg shadow-2xl mt-5 bg-white/10 mx-auto p-12 rounded-2xl space-y-6">
                <h2 className="text-2xl font-semibold text-center">Interview Details</h2>

                <div>
                    <label className="block mb-2 font-medium">Difficulty</label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full p-2 border-b-2 border-neutral-500/20 placeholder:text-neutral-400 focus:outline-none"
                    >
                        <option value="">Select Difficulty</option>
                        {["easy", "intermediate", "pro", "mixed"].map((d) => (
                            <option className="opacity-15" key={d} value={d}>
                                {d.charAt(0).toUpperCase() + d.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Interview Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-2 border-b-2 border-neutral-500/20 placeholder:text-neutral-400 focus:outline-none"
                    >
                        <option value="">Select Type</option>
                        {["technical", "behavioral", "both"].map((t) => (
                            <option key={t} value={t}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Experience Level</label>
                    <input
                        type="text"
                        placeholder="e.g., 2 years, Fresher, Senior Developer..."
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full p-2 border-b-2 border-neutral-500/20 placeholder:text-neutral-400 focus:outline-none"
                    />
                </div>

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
                            className="flex-1 p-2 border-b-2 border-neutral-500/20 placeholder:text-neutral-400 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleAddTech}
                            className="px-4 py-2 rounded-lg bg-orange-400/40 hover:bg-orange-700/40 cursor-pointer"
                        >
                            Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {techStack.map((tech) => (
                            <div
                                key={tech}
                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-black text-sm"
                            >
                                <span>{tech}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTech(tech)}
                                    className="text-red-400 hover:text-red-500 cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Number of Questions</label>
                    <input
                        type="number"
                        placeholder={`Minimum ${MIN_QUESTIONS}`}
                        value={noOfQuestions}
                        onChange={(e) => setNoOfQuestions(e.target.value)}
                        className="w-full p-2 border-b-2 border-neutral-500/20 placeholder:text-neutral-400 focus:outline-none focus:ring-2 
                            appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none
                            [&::-webkit-outer-spin-button]:appearance-none"
                    />
                </div>

                <Toast type={message.type} message={message.text} setMessage={setMessage} />

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="w-full py-2 rounded-lg bg-black/60 hover:bg-black disabled:bg-black transition-colors duration-500 cursor-pointer"
                        disabled={loading}
                        onClick={(e) => handleClick(e, false)}
                    >
                        Take later
                    </button>
                    <button
                        type="submit"
                        className="w-full py-2 rounded-lg bg-black/60 hover:bg-black disabled:bg-black transition-colors duration-500 cursor-pointer"
                        disabled={loading}
                        onClick={(e) => handleClick(e, true)}
                    >
                        Take now
                    </button>
                </div>
            </form>
        </main>
    );
}
