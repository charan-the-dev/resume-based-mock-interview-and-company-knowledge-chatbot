import ChatArea from "@/components/ChatArea";
import Assistant from "@/components/Assistant";
import Questions from "./Questions";

export default function ChatLayout({ interviewId }) {    
    return (
        <div className="flex h-screen max-w-screen p-3">
            <section className="max-w-4xl w-full h-full p-3">
                <Questions interviewId={interviewId} />
            </section>
            <section className="flex-1/3 p-3 flex space-y-6 flex-col justify-center">
                <Assistant />
                <ChatArea />
            </section>
        </div>
    )
}