import InterviewButton from "@/components/InterviewButton";
import ResumeButton from "@/components/ResumeButton";

export default function page() {
    return (
        <div>
            <div className="text-center text-3xl font-bold">
                This is the dashboard page!
            </div>
            <div className="flex my-30 justify-around">
                <InterviewButton />
                <ResumeButton />
            </div>
        </div>
    )
}
