"use client";

import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export default function MessageInput({ onSend }) {

    const [message, setMessage] = useState("");

    function handleSend(e) {
        e.preventDefault();
        const newMessage = {
            id: crypto.randomUUID(),
            text: message,
            sender: "user",
            timestamp: new Date().toISOString()
        }
        setMessage("");

        onSend(newMessage);
    }


    return (
        <form onSubmit={(e) => handleSend(e)} className="relative flex gap-5 justify-center items-center w-3/4 m-auto bg-neutral-200/75 rounded-full pr-2 text-gray-800 placeholder-gray-700 ouline-none">
            <input
                className="w-full p-2 px-5 outline-none"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your answer..."
            />
            <button
                className="cursor-pointer p-2 text-gray-800 hover:text-gray-900 transition-colors"
                type="submit"
            >
                <FontAwesomeIcon icon={faPaperPlane} />
            </button>
        </form>
    );
}
