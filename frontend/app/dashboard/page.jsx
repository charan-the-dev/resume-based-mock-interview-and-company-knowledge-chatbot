import InterviewButton from "@/components/interview/InterviewButton";
import Interviews from "@/components/interview/Interviews";
import ResumeButton from "@/components/resume/ResumeButton";

export default function page() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-900 to-black text-emerald-100">
            {/* Top bar */}
            <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white font-bold shadow-md">
                        N
                    </div>
                    <div className="text-sm">Hallo! 👋, <span className="font-semibold text-emerald-200">test_6tt0cl</span></div>
                </div>
                <div className="text-center">
                    <h1 className="text-2xl md:text-3xl font-bold">This is the dashboard page!</h1>
                </div>
                <div>
                    <button className="px-3 py-1.5 rounded-lg bg-pink-400 text-black font-medium shadow-sm">Logout</button>
                </div>
            </header>

            {/* Action buttons */}
            <section className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="w-full md:w-1/3 flex justify-center">
                        <InterviewButton />
                    </div>
                    <div className="w-full md:w-1/3 flex justify-center">
                        <ResumeButton />
                    </div>
                </div>
            </section>

            {/* Interviews list */}
            <main className="max-w-7xl mx-auto px-6 pb-20">
                <Interviews />
            </main>

            {/* bottom spacer */}
            <footer className="h-28 bg-black/20 mt-8 rounded-t-2xl" />
        </div>
    );
}
