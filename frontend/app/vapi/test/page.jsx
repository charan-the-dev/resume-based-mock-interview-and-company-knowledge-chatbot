"use client";

import Assistant from "@/components/Assistant";
import ChatArea from "@/components/ChatArea";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { vapi } from "@/lib/actions/vapi.sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function page() {

    const router = useRouter();

    const [callStatus, setCallStatus] = useState("INACTIVE");
    const [messages, setMessages] = useState([]);
    const [isSpeaking, setSpeaking] = useState(false);

    useEffect(() => {
        function onCallStart() {
            setCallStatus("ACTIVE");
        }

        function onCallEnd() {
            setCallStatus("FINISHED");
            router.push("/dashboard");
        }

        function onMessage(message) {
            if (message?.type === "transcript" && message.transcriptType === "final") {
                const newMessage = { sender: message.role, content: message.transcript }
                console.log(newMessage);
                setMessages(prev => [...prev, newMessage]);
            }
        }

        function onSpeechStart() {
            console.log("Speech is starting!");
            setSpeaking(true);
        }

        function onSpeechEnd() {
            console.log("Speech has Ended!");
            setSpeaking(false);
        }

        function onError(e) {
            console.log("There was an error from Vapi", e);
            vapi.end();
        }

        try {
            vapi.on("call-start", onCallStart);
            vapi.on("call-end", onCallEnd);
            vapi.on("message", onMessage);
            vapi.on("speech-start", onSpeechStart);
            vapi.on("speech-end", onSpeechEnd);
            vapi.on("error", onError);
        } catch (e) {
            console.log("There was an error in Vapi events", e);
            vapi.end();
        }

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onError);
        }
    }, []);

    async function startCall() {
        const user = await getCurrentUser();
        vapi.start(process.env.NEXT_PUBLIC_VAPI_TEST_ASSISTANT_ID, {
            variableValues: {
                username: user?.username,
                userId: user?.id
            }
        });
    }

    function endCall() {
        vapi.end();
        console.log("Call Ended");
    }

    return (
        <main className="w-full min-h-screen flex">
            <aside className="max-w-sm">
                <Assistant name={"Lico"} isSpeaking={isSpeaking} />
            </aside>
            <div className="w-full flex flex-col">
                <section className="flex justify-end p-3">
                    {callStatus !== "ACTIVE" ?
                        <button
                            className="rounded-full px-5 py-2 w-56 bg-green-400/30 cursor-pointer"
                            onClick={startCall}
                        >
                            <span className="relative">
                                {callStatus === "INACTIVE" || callStatus === "FINISHED"
                                    ? "Start Conversation"
                                    : ". . ."}
                            </span>
                        </button> :
                        <button
                            className="rounded-full px-5 py-2 w-56 bg-red-400 cursor-pointer"
                            onClick={endCall}
                        >
                            End Conversation
                        </button>
                    }
                </section>
                <ChatArea messages={messages} />
            </div>
        </main>
    )
}