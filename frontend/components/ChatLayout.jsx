import ChatArea from "./ChatArea";
import Assistant from "./Assistant";

export default function ChatLayout({ messages, onSendMessage }) {
    return (
        <div className="flex h-screen">
            <Assistant />
            <ChatArea messages={messages} onSendMessage={onSendMessage} />
        </div>
    );
};