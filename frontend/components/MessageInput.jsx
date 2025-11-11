"use client";

import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

export default function MessageInput({ questionFormat, initialValue = "", onSubmit }) {
    const [message, setMessage] = useState(initialValue);

    useEffect(() => {
        setMessage(initialValue);
    }, [initialValue]);

    const isTextFormat = questionFormat === "text";

    const handleSend = (e) => {
        e.preventDefault();
        if (typeof onSubmit === "function") {
            onSubmit(message);
        }
        setMessage("");
    };

    return (
        <form
            onSubmit={handleSend}
            className="relative flex gap-5 justify-center items-center w-3/4 m-auto"
        >
            <textarea
                className={`max-w-4xl bg-white/20 backdrop-blur-md text-gray-900 placeholder-gray-600 
                    dark:bg-white/10 dark:text-gray-100 dark:placeholder-gray-400 
                    rounded-2xl px-4 py-3 resize-none outline-none border border-transparent 
                    transition-all duration-1000 shadow-sm 
                    scrollbar-thin scrollbar-thumb-gray-400/40 scrollbar-track-transparent 
                    hover:scrollbar-thumb-gray-400/60 disabled:opacity-40
                    ${isTextFormat ? "h-32 w-full" : "w-xs h-14 p-0"}`}
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(156,163,175,0.4) transparent",
                }}
                disabled={!isTextFormat}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isTextFormat ? "Type your answer..." : "Select the Correct option(s)"}
            />
            <button
                type="submit"
                className="py-2 px-5 bg-black/60 text-white cursor-pointer hover:bg-black disabled:opacity-30 transition-all rounded-xl duration-500 flex items-center gap-2"
                disabled={!isTextFormat}
            >
                <FontAwesomeIcon icon={faPaperPlane} />
                Save
            </button>
        </form>
    );
}
