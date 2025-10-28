import { useRouter } from 'next/navigation';
import React from 'react'

const generateRandomHue = () => {
    return Math.floor(Math.random() * 255) - Math.floor(Math.random() * 150);
}

const Interview = ({ interviewParams }) => {
    const { id, difficulty, type, experience, techStack } = interviewParams;
    const router = useRouter();
    
    return (
        <div
            className="p-5 border"
            style={{ background: `hsl(${generateRandomHue()},50%,50%,.2)` }}
            onClick={() => router.push(`/interview/studio/${id}`)}
        >
            <div className="">Id: {id}</div>
            <div className="">difficulty: {difficulty}</div>
            <div className="">type: {type}</div>
            <div className="">experience: {experience}</div>
            <div className="">techStack: [{techStack.join(", ")}]</div>
        </div>
    )
}

export default Interview