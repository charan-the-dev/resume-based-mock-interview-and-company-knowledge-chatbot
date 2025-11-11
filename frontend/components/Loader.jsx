"use client";

export default function Loader({ disabled }) {
    return (
        <>
            {
                disabled &&
                <div className="flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                </div>
            }
        </>
    );
}
