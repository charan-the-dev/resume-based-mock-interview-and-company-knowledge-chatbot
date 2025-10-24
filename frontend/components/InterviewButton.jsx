"use client";

import { useRouter } from "next/navigation";


const InterviewButton = () => {
    const router = useRouter();
    return (
        <button
            className='py-2 px-5 rounded bg-orange-200/30 border-2 border-orange-400 cursor-pointer'
            type="button"
            onClick={() => router.push("/interview/new")}
        >
            Create an Interview
        </button>
    )
}

export default InterviewButton