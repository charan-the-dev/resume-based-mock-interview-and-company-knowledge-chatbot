import ChatArea from "./ChatArea";
import Sidebar from "./Sidebar";

export default function ChatLayout({ messages, onSendMessage }) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <ChatArea messages={messages} onSendMessage={onSendMessage} />
        </div>
    );
};