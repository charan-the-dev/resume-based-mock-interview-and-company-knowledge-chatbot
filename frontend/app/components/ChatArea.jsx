import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatArea({ messages, onSendMessage }) {
    return (
        <div className="flex-1 flex flex-col relative">
            <div className="flex-1 px-7 p-3 pb-15 overflow-y-auto custom-scrollbar">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}
            </div>
            <div className="p-2 bg-white/5 backdrop-blur-xl absolute bottom-0 w-full">
                <MessageInput onSend={onSendMessage} />
            </div>
        </div>
    );
};