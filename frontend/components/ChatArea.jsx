"use client";

import MessageBubble from "./MessageBubble";

export default function ChatArea({ messages = [] }) {
    return (
        <section className="w-full h-full flex flex-col pt-3 bg-white/5 rounded-xl relative">
            {messages && messages.length > 0 ? (
                <div className="px-7 p-3 pb-15 overflow-y-auto custom-scrollbar">
                    {messages.map((message, i) => (
                        <MessageBubble key={i} message={message} />
                    ))}
                </div>
            ) : (
                <div className="w-full h-full flex justify-center items-center">
                    There are no messages yet!
                </div>
            )}
        </section>
    );
}
