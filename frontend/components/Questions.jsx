"use client";

import { useEffect, useState } from "react";
import { getQuestions } from "@/lib/actions/interview.action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Questions({ interviewId }) {
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [currQuestion, setCurrQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);

    // Fetch questions
    useEffect(() => {
        async function fetchQuestions() {
            const res = await getQuestions(interviewId);
            if (res.ok) {
                setQuestions(res.questions);
                setCurrQuestion(res.questions[0]);
            }
        }
        fetchQuestions();
    }, [interviewId]);

    // Handle answer change
    const handleAnswerChange = (value, option) => {
        if (!currQuestion) return;

        if (currQuestion.format === "mcq-multiple") {
            setAnswers((prev) => {
                const prevAns = prev[currQuestion.question] || [];
                const updated = prevAns.includes(option)
                    ? prevAns.filter((o) => o !== option) // removes from list of selected answers
                    : [...prevAns, option]; // adds to the list of selected answers
                const updatedObj = {
                    question: currQuestion.question,
                    answer: updated
                }
                return [ ...prev, updatedObj ];
            });
        } else {
            setAnswers((prev) => ({
                ...prev,
                [currQuestion.question]: value,
            }));
        }
    };

    // Navigation
    const handleNext = () => {
        if (index < questions.length - 1) {
            const newIndex = index + 1;
            setIndex(newIndex);
            setCurrQuestion(questions[newIndex]);
        }
    };

    const handlePrevious = () => {
        if (index > 0) {
            const newIndex = index - 1;
            setIndex(newIndex);
            setCurrQuestion(questions[newIndex]);
        }
    };

    const handleSubmit = () => {
        if (answers.length !== questions.length) {
            alert("You have completed all the question. Are you sure you want to exit?");
        }
        console.log(answers);
        alert("Quiz submitted! Check console for answers.");
    };

    // UI Rendering
    if (!currQuestion) {
        return (
            <div className="text-center text-neutral-400 mt-10">
                Loading questions...
            </div>
        );
    }

    const userAnswer = answers[currQuestion.question] || "";

    return (
        <div className="h-full bg-white/5 rounded-xl backdrop-blur-md p-8">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-4">
                {/* <h2 className="text-lg font-semibold text-white capitalize">
                    {currQuestion.relatedSkill}
                </h2>
                <span
                    className={`px-3 py-1 text-sm rounded-full capitalize ${currQuestion.difficulty === "easy"
                            ? "bg-green-500/20 text-green-400"
                            : currQuestion.difficulty === "intermediate"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                        }`}
                >
                    {currQuestion.difficulty}
                </span> */}
                <h2 className="text-xl w-full text-center font-semibold text-white uppercase">
                    Question {index + 1}
                </h2>
            </div>

            {/* Question Text */}
            <p className="text-neutral-100 text-lg mb-6 font-medium">
                {currQuestion.question}
            </p>

            {/* Input Types */}
            <div className="flex flex-col gap-3">

                {/* MCQ SINGLE */}
                {currQuestion.format === "mcq-single" &&
                    currQuestion.options?.map((option, i) => (
                        <label
                            key={i}
                            className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${userAnswer === option
                                ? "bg-black/50"
                                : "bg-white/5"
                                }`}
                        >
                            <input
                                type="radio"
                                name="singleChoice"
                                value={option}
                                checked={userAnswer === option}
                                onChange={() => handleAnswerChange(option)}
                                className="accent-blue-500"
                            />
                            <span className="text-neutral-300">{option}</span>
                        </label>
                    ))}

                {/* MCQ MULTIPLE */}
                {currQuestion.format === "mcq-multiple" &&
                    currQuestion.options?.map((option, i) => (
                        <label
                            key={i}
                            className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${userAnswer.includes(option)
                                ? "bg-black/50"
                                : "bg-white/5"
                                }`}
                        >
                            <input
                                type="checkbox"
                                value={option}
                                checked={userAnswer.includes(option)}
                                onChange={() => handleAnswerChange(null, option)}
                                className="accent-emerald-500"
                            />
                            <span className="text-neutral-300">{option}</span>
                        </label>
                    ))}
            </div>

            <button
                className="absolute top-1/2 left-5 bg-white/10 p-3 rounded-full hover:bg-white/20 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                onClick={handlePrevious}
                disabled={index === 0}
            >
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <button
                className="absolute top-1/2 right-5 bg-white/10 p-3 rounded-full hover:bg-white/20 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                onClick={handleNext}
                disabled={index === questions.length - 1}
            >
                <FontAwesomeIcon icon={faChevronRight} />
            </button>

            <button onClick={handleSubmit} className="bg-black px-5 py-2 rounded-lg absolute bottom-5 left-1/2 -translate-1/2 z-30" type="submit">
                Submit
            </button>
        </div>
    );
}
