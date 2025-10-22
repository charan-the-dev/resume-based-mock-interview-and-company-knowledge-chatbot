import { useState } from "react";

export default function Assistant() {
    const assistantName = "MILO";
    const [isPaused, setPaused] = useState(true);

    return (
        <div className="w-1/3 p-8 bg-white/10 flex flex-col gap-10 items-center justify-center">
            <div className="italic text-neutral-400"><em className="font-bold text-neutral-200">Note:</em> As an AI voice assistant, I am currently at the development stage so, I would request you that I would complete my sentence first then I will pause and listen to your reply. Please bare with me!</div>
            <div className={`${isPaused ? "voice-assistant.pause" : "voice-assistant"} w-40 h-40 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium`}>
                <svg width="52.8" height="52.8" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2.6" y="23.3" width="2.2" height="4.87" fill="#000000" />
                    <rect x="7.2" y="21.6" width="2.2" height="7.26" fill="#000000" />
                    <rect x="13.2" y="16.2" width="2.2" height="14.52" fill="#111111" />
                    <rect x="19.2" y="10.8" width="2.2" height="29.04" fill="#222222" />
                    <rect x="25.2" y="14.4" width="2.2" height="19.36" fill="#111111" />
                    <rect x="31.2" y="18" width="2.2" height="9.68" fill="#000000" />
                    <rect x="37.2" y="21.6" width="2.2" height="4.84" fill="#000000" />
                </svg>
            </div>
            <h1 className="text-4xl uppercase">{assistantName}</h1>
        </div>
    );
}
