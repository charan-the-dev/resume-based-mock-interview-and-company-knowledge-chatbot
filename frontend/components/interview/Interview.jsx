"use client";

import { useRouter } from "next/navigation";
import React from "react";

const generateRandomHue = () => {
    return Math.floor(Math.random() * 255) - Math.floor(Math.random() * 150);
};

const Interview = ({ interviewParams }) => {
    const { id, difficulty, type, experience, techStack } = interviewParams;
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/interview/studio/${id}`)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-2xl transition-transform hover:scale-[1.01] hover:shadow-emerald-600/30"
            style={{
                background: `linear-gradient(180deg, rgba(5,7,6,0.95), rgba(15,20,15,0.95))`,
                border: `1px solid rgba(0,0,0,0.4)`,
            }}
        >
            {/* Accent color bar */}
            <div
                className="absolute top-0 left-0 h-1 w-full"
                style={{
                    background: `hsl(${generateRandomHue()}, 70%, 45%)`,
                }}
            ></div>

            {/* Card content */}
            <div className="relative p-6 md:p-8 text-emerald-100">
                {/* Top badge */}
                <div className="absolute right-4 top-4 bg-black/60 border border-emerald-800 rounded-bl-lg px-4 py-1.5 text-emerald-200 font-semibold text-sm z-10">
                    {difficulty}
                </div>

                {/* Card heading */}
                <div className="flex items-center gap-5">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-emerald-100">Interview #{id}</h2>
                        <p className="text-sm text-emerald-300/80 mt-1 capitalize">
                            {type} • {experience} years
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-emerald-800/40"></div>

                {/* Tech stack section */}
                <div className="text-sm">
                    <p className="mb-2 text-emerald-300 font-semibold uppercase tracking-wide">
                        Tech Stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {techStack && techStack.length > 0 ? (
                            techStack.map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 rounded-full bg-black/40 border border-emerald-700/50 text-emerald-200 text-xs shadow-sm hover:bg-emerald-600/10 transition"
                                >
                                    {tech}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400 italic">No tech stack listed</span>
                        )}
                    </div>
                </div>

                {/* Bottom button */}
                <div className="mt-8 flex justify-end">
                    <button
                        type="button"
                        className="px-6 py-2.5 rounded-full bg-violet-200 text-black font-semibold shadow-md group-hover:bg-violet-100 transition"
                    >
                        Open Interview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Interview;
