"use client";

import { useState } from "react";
import Toast from "@/components/Toast";
import { generateQuestions } from "@/lib/actions/llm";
import { createInterview } from "@/lib/actions/interview.action";
import { useRouter } from "next/navigation";

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

    const handleSubmit = async (e) => {
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
        router.push("/dashboard")
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="max-w-lg mx-auto p-6 rounded-2xl shadow-xl space-y-6"
            >
                <h2 className="text-2xl font-semibold text-center">Interview Details</h2>

                <div>
                    <label className="block mb-2 font-medium">Difficulty</label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full p-2 rounded-lg border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Difficulty</option>
                        {["easy", "intermediate", "pro", "mixed"].map((d) => (
                            <option key={d} value={d}>
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
                        className="w-full p-2 rounded-lg border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full p-2 rounded-lg border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">Tech Stack</label>
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
                            className="flex-1 p-2 rounded-lg border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddTech}
                            className="px-4 py-2 rounded-lg bg-blue-200 hover:bg-blue-400 cursor-pointer"
                        >
                            Add
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {techStack.map((tech) => (
                            <div
                                key={tech}
                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-700 text-sm"
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
                        className="w-full p-2 rounded-lg border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                            appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none
                            [&::-webkit-outer-spin-button]:appearance-none"
                    />
                </div>

                <Toast type={message.type} message={message.text} setMessage={setMessage} />

                <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-sky-300 hover:bg-sky-500 font-semibold disabled:bg-pink-300"
                    disabled={loading}
                >
                    {
                        loading ? "Generating,,," : "Generate Interview"
                    }
                </button>
            </form>
        </>
    );
}
