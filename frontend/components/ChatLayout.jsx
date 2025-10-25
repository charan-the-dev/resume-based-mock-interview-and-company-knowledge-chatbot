import ChatArea from "@/components/ChatArea";   
import Assistant from "@/components/Assistant";

export default function ChatLayout() {
    return (
        <div className="flex h-screen">
            <Assistant />
            <ChatArea />
        </div>
    );
};