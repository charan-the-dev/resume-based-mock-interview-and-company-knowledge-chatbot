"use client";
import { useState, useEffect } from "react";
import MessageInput from "./MessageInput";

export default function Question({
    question = {},
    currentIndex = 0,
    answers = {},
    onAnswerChange = () => { },
}) {
    const [localAnswer, setLocalAnswer] = useState(
        answers[currentIndex]?.answer || (question.format === "mcq-multiple" ? [] : "")
    );

    useEffect(() => {
        if (answers[currentIndex] !== undefined) {
            setLocalAnswer(answers[currentIndex]?.answer);
        } else {
            setLocalAnswer(question.format === "mcq-multiple" ? [] : "");
        }
    }, [answers, currentIndex, question.format]);

    const questionText =
        typeof question === "string"
            ? question
            : question?.question || "Cannot get Question!";

    const handleChange = (value) => {
        if (question.format === "mcq-multiple") {
            let updated;
            if (localAnswer.includes(value)) {
                updated = localAnswer.filter((v) => v !== value);
            } else {
                updated = [...localAnswer, value];
            }
            setLocalAnswer(updated);
            onAnswerChange(currentIndex, updated); // now safe
        } else {
            setLocalAnswer(value);
            onAnswerChange(currentIndex, value);
        }
    };

    const handleTextSubmit = (value) => {
        setLocalAnswer(value);
        onAnswerChange(currentIndex, value);
    };

    return (
        <div className="lg:max-w-5xl md:max-w-3xl w-full h-full bg-white/5 rounded-xl backdrop-blur-md p-5 relative flex flex-col items-center text-center">
            <div className="w-full h-full flex flex-col items-center py-5 space-y-6 bg-white/5 rounded-xl overflow-hidden">
                {/* Question Header */}
                <h2 className="text-2xl text-center font-semibold text-white uppercase">
                    Question {currentIndex + 1}
                </h2>

                {/* Question Text */}
                <p className="text-neutral-100 px-[7vw] pb-5 text-left text-lg font-medium overflow-x-hidden">
                    {questionText}
                </p>

                {/* Answer Section */}
                <div className="w-full flex flex-col items-start px-[7vw] space-y-4 text-left">
                    {question.format === "mcq-single" &&
                        question.options?.map((option, index) => (
                            <label
                                key={index}
                                className={`group relative flex items-center justify-between gap-4 p-4 rounded-xl w-full cursor-pointer border transition-all duration-200
                                    ${localAnswer === option
                                        ? "bg-emerald-500/20 border-emerald-400/30 ring-1 ring-emerald-400"
                                        : "bg-white/10 hover:bg-white/20 border-transparent"
                                    }`}
                                onClick={() => handleChange(option)}
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div
                                        className={`h-5 w-5 aspect-square rounded-full border-2 flex items-center justify-center transition-all ${localAnswer === option
                                            ? "border-emerald-400 bg-emerald-500/40"
                                            : "border-gray-400"
                                            }`}
                                    >
                                        {localAnswer === option && (
                                            <div className="h-2.5 w-2.5 aspect-square rounded-full bg-emerald-300 transition-all" />
                                        )}
                                    </div>

                                    <span className="text-gray-100 text-left leading-relaxed select-none">
                                        {option}
                                    </span>
                                </div>
                            </label>
                        ))}

                    {question.format === "mcq-multiple" &&
                        question.options?.map((option, index) => (
                            <label
                                key={index}
                                className={`relative flex items-start space-x-3 p-3 rounded-lg cursor-pointer w-full ${localAnswer.includes(option) ? "bg-emerald-400/30 ring-1 ring-emerald-400" : "bg-white/20"}`}
                            >
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={localAnswer.includes(option)}
                                    onChange={() => handleChange(option)}
                                    className="mt-1 h-5 w-5 shrink-0 accent-emerald-400 cursor-pointer"
                                />
                                <span className="text-left text-gray-100 leading-relaxed">{option}</span>
                            </label>
                        ))}
                </div>

                {question.format === "text" && (
                    <div className="">
                        {localAnswer ?? "Type your Answer and click Save"}
                    </div>
                )}

                {/* Message Input */}
                <section className="absolute w-full max-w-4xl bottom-10">
                    <MessageInput
                        questionFormat={question.format}
                        initialValue={localAnswer}
                        onSubmit={handleTextSubmit}
                    />
                </section>
            </div>
        </div>
    );
}
