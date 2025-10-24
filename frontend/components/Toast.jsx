"use client";

import { useEffect } from "react";

/**
 * A reusable alert message component with fade/slide animation.
 * 
 * Props:
 * - message (string): The text to display
 * - setMessage (function): Setter to clear or update the message
 * - type (string): 'warning' | 'success' | 'error' (optional)
 */
export default function Toast({ message, setMessage, type = "warning" }) {

  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timeout);
  }, [message, setMessage]);

  if (!message) return null;

  const colorMap = {
    warning: "bg-orange-300 border-orange-800 text-orange-700",
    success: "bg-green-300 border-green-800 text-green-700",
    error: "bg-red-300 border-red-800 text-red-700",
  };

  return (
    <div
      className={`
        fixed top-5 right-5 flex items-center justify-center
        rounded-lg border-2 gap-3 p-3 shadow-lg
        transform transition-all duration-500 ease-in-out
        animate-fadeSlideIn
        ${colorMap[type]}
      `}
    >
      <div
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/40`}
      >
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
        </svg>
      </div>

      <div className="max-w-xs text-sm font-medium">{message}</div>

      <button
        className="border cursor-pointer w-6 h-6 flex items-center justify-center rounded-full bg-red-100
                     text-sm font-bold
                   transition-all duration-300"
        onClick={() => setMessage("")}
      >
        ✕
      </button>
    </div>
  );
}
