"use client";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export default function MessageInput(onSend, placeholder = 'Enter your answer here...') {
    const [text, setText] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onSend(text);
            setText('');
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="relative flex gap-5 justify-center items-center w-3/4 m-auto bg-neutral-200/75 rounded-full pr-2 text-gray-800 placeholder-gray-700 ouline-none">
            <input
                className="w-full p-2 px-5 outline-none"
                type="text"
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder}
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
