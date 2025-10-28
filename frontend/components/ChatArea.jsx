"use client";

import { useState } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatArea({ messages }) {
    // const [messages, setMessages] = useState([{
    //     id: 1,
    //     sender: "user",
    //     text: "hai"
    // }]);

    // function updateMessages(message) {
    //     setMessages(prev => [...prev, message]);
    // }

    return (
        <section className="w-full h-full flex flex-col relative">
            {
                messages.length > 0
                    ? <div className="px-7 p-3 pb-15 overflow-y-auto custom-scrollbar">
                        {messages.map((message, i) => (
                            <MessageBubble key={i} message={message} />
                        ))}
                    </div>
                    : <div className="w-full h-full flex justify-center items-center">There are no messages yet!</div>
            }
            {/* <div className="p-2 bg-white/5 backdrop-blur-sm shadow-[inset_0_0_1.75rem_.15rem_#fff2] absolute bottom-0 w-full">
                <MessageInput onSend={updateMessages} />
            </div> */}
        </section>
    );
}