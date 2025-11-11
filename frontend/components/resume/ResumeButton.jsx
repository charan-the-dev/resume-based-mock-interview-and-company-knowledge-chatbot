"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const ResumeButton = () => {
    const router = useRouter();

    return (
        <Link href="/resume-upload">
            <button
                className="py-3 px-6 rounded-xl bg-black/60 border border-emerald-300 shadow-md hover:shadow-lg transition text-sm md:text-base"
                type="button"
                onClick={() => router.push("/resume-upload")}
            >
                <span className="text-emerald-100">Upload Resume for Analysis</span>
            </button>
        </Link>
    );
};

export default ResumeButton;
