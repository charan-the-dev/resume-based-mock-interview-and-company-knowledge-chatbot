"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Loader from "../Loader";

export default function InterviewIntro() {
    const [isClosed, setClosed] = useState(false);
    const router = useRouter();
    const containerRef = useRef();

    function onExit() {
        router.push("/dashboard");
    }


    function onStart() {
        setClosed(true);
        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.style.display = "none";
            }
            setClosed(false);
        }, 2000);
    }


    return (
        <>
            <div ref={containerRef} className="absolute w-screen h-screen bg-black text-white shadow-xl p-8 z-50 text-center">
                <Loader disabled={isClosed} />
                <h1 className="text-2xl font-semibold mb-4">Interview Instructions</h1>

                <ul className="text-left mb-6 space-y-3">
                    <li>💬 Answer each question carefully and clearly.</li>
                    <li>🧠 You can’t go back once a question is submitted.</li>
                    <li>🎤 Speak naturally if it’s a voice interview.</li>
                    <li>⏱️ Stay within the time limit.</li>
                    <li>📵 Avoid switching tabs or minimizing the window.</li>
                </ul>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onExit}
                        className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-400"
                        disabled={isClosed}
                    >
                        Go Back
                    </button>
                    <button
                        onClick={onStart}
                        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        disabled={isClosed}
                    >
                        Start
                    </button>
                </div>
            </div>
        </>
    );
}
