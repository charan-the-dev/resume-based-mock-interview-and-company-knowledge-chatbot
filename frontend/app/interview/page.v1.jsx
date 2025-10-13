"use client";

import { useState, useEffect } from "react";
import { questions } from "../database/questions";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const totalTime = 4820; // 1hr 20min 20s
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    console.log(Object.keys(answers).length);

    if (questions.length === Object.keys(answers).length) {
      console.log("The Answers are: ", answers);
    }
  }, [answers]);

  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600));
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleSubmit = () => {
    if (currentQ < questions.length - 1) {
      if (
        !confirm("You still have questions left. Do you really want to submit?")
      )
        return;
    }
    alert("Test submitted!");
  };

  const handleAnswer = (qIndex, option) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <header className="flex justify-between items-center bg-[#739679 px-6 py-4">
        <h1 className="w-full font-bold text-2xl text-center">Mock Interview</h1>
        {/* <div className="text-lg">Time left: {formatTime(timeLeft)}</div> */}
        <button className="bg-red-900/75 px-7 py-2 rounded-lg cursor-pointer hover:bg-red-950 transition-colors">
          Exit
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="h-full relative flex p-6 gap-10">
        {/* QUESTION BOX */}
        <div className="relative flex flex-col justify-between p-10 flex-1 bg-white/5 shadow-neutral-950/25 shadow-2xl to-white/10 rounded-lg">
          <div className="flex flex-col gap-4">
            <p className="text-lg mb-4">
              {currentQ + 1}. {questions[currentQ].q}
            </p>
            <div className="space-y-3">
              {questions[currentQ].options.map((opt, i) => (
                <div key={i} className={`max-w-2xl p-2 px-5 rounded-lg bg-white/5 hover:bg-white/15 transition-colors ${answers[currentQ] === opt ? "bg-white/20" : "bg-white/5"}`}>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      className="hidden"
                      type="radio"
                      name={`q${currentQ}`}
                      checked={answers[currentQ] === opt}
                      onChange={() => handleAnswer(currentQ, opt)}
                    />
                    <span className="opacity-75">{String.fromCharCode(65 + i)}.</span>
                    <span>{opt}</span>
                  </label>
                </div>
              ))} 
            </div>
            <div className="flex gap-4 items-end absolute right-10 font-bold bottom-0 pointer-events-none">
              <span className="text-[40vh] opacity-40 leading-none text-emerald-950">{String(currentQ + 1).padStart(2, "0")}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="w-fit bg-[hsl(175,10%,10%)] px-5 py-2 rounded-lg hover:bg-white/25 cursor-pointer"
              onClick={handleSubmit}
            >
              Mark as read
            </button>
            <button
              className="w-fit bg-[hsl(175,0%,0%)] px-5 py-2 rounded-lg hover:bg-white/25 cursor-pointer"
              onClick={handleSubmit}
            >
              Save & Next
            </button>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="bg-white/5 shadow-2xl p-10 rounded-lg">
          <h3 className="font-semibold text-2xl text-center mb-5">SECTION A</h3>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-12 h-12 flex items-center justify-center rounded-md shadow-inner shadow-neutral-950/75 cursor-pointer
                  ${currentQ === i
                    ? "bg-emerald-950"
                    : answers[i]
                      ? "bg-green-700/50"
                      : "bg-transparent"
                  }
                `}
                onClick={() => setCurrentQ(i)}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQ((p) => (p > 0 ? p - 1 : p))}
              className="bg-[#2c5e52] px-3 py-2 rounded hover:bg-[#1e4039] cursor-pointer"
            >
              {/* &lt; */}
              <ChevronLeft />
            </button>
            <button
              onClick={() => setCurrentQ((p) => (p < questions.length - 1 ? p + 1 : p))}
              disabled={currentQ === questions.length - 1}
              className="bg-[#2c5e52] px-3 py-2 rounded hover:bg-[#1e4039] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {/* &gt; */}
              <ChevronRight />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
