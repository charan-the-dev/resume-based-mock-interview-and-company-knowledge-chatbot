import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#163832", color: "#fff" }}
    >
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold">AI Mock Interview & Resume Analysis</h1>
        <p className="mt-3 text-lg opacity-90">
          Prepare smart. Improve faster. Step confidently into your career journey.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Mock Interview Section */}
        <div
          className="p-8 rounded-xl shadow-lg transition transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
          style={{ backgroundColor: "#1F4A45" }}
        >
          <h2 className="text-2xl font-semibold mb-4">Mock Interview</h2>
          <p className="opacity-90 mb-6">
            Conduct a personalized mock interview based and get real-time feedback.
          </p>
          <button
            className="px-6 py-2 rounded-md font-medium transition"
            style={{ backgroundColor: "#DAF1DE", color: "#163832" }}
          >
            Start Interview
          </button>
        </div>

        {/* Resume Analysis Section */}
        <div
          className="p-8 rounded-xl shadow-lg transition transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
          style={{ backgroundColor: "#1F4A45" }}
        >
          <h2 className="text-2xl font-semibold mb-4">Resume Analysis</h2>
          <p className="opacity-90 mb-6">
            Upload your resume and receive AI-powered enhancement suggestions.
          </p>
          <button
            className="px-6 py-2 rounded-md font-medium transition"
            style={{ backgroundColor: "#DAF1DE", color: "#163832" }}
          >
            Analyze Resume
          </button>
        </div>

      </div>

      <footer className="mt-16 text-sm opacity-70">
        © {new Date().getFullYear()} AI Interview Platform 
         @ All Rights Reserverd 
      </footer>
    </div>
  );
}
