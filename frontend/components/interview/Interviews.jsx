"use client";

import { getAllInterviews } from "@/lib/actions/interview.action";
import { useEffect, useState } from "react";
import Interview from "./Interview";

const Interviews = () => {
    const [interviews, setInterviews] = useState(null);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const { interviews } = await getAllInterviews();
                setInterviews(interviews);
            } catch (error) {
                console.error('Error fetching interviews:', error);
            }
        };

        fetchInterviews();
    }, []);

    return (
        <>
            {
                interviews
                    ? <div className="border grid gap-2 p-2 px-10 items-center justify-center grid-cols-3">
                        {interviews.map(interview => (
                            <div key={interview.id}>
                                <Interview interviewParams={interview} key={interview.id} />
                            </div>
                        ))}
                    </div>
                    : <div className="">There are no Interviews yet</div>
            }
        </>
    )
}

export default Interviews