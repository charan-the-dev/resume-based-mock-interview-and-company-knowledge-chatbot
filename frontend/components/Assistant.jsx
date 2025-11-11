import Image from "next/image";

export default function Assistant({ isSpeaking }) {
    return (
        <div className="p-8 rounded-xl bg-white/15 backdrop-blur-3xl flex flex-col gap-10 items-center justify-center">
            {/* <div className="italic text-neutral-400"><em className="font-bold text-neutral-200">Note:</em> As an AI voice assistant, I am currently at the development stage so, I would request you that I would complete my sentence first then I will pause and listen to your reply. Please bare with me!</div> */}
            <div className={`${isSpeaking ? "voice-assistant" : "voice-assistant pause"} w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium`}>
                <Image width={40} height={40} src="/music-bars.svg" alt="Music Bars Image" />
            </div>
        </div>
    );
}
