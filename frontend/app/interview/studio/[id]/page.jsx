"use client";

import Question from "@/components/Question";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getQuestions, saveAnswers } from "@/lib/actions/interview.action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import InterviewIntro from "@/components/interview/InterviewIntro";

const Page = () => {
    const { id } = useParams();

    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState({});
    const [answers, setAnswers] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const fetchQuestions = async () => {
            const res = await getQuestions(id);
            if (res?.ok && Array.isArray(res.questions)) {
                setQuestions(res.questions);
                setIndex(0);
                setQuestion(res.questions[0]);
            } else {
                console.error("Failed to fetch questions or invalid format:", res);
            }
        };
        fetchQuestions();
    }, [id]);

    useEffect(() => {
        if (questions.length > 0) {
            setQuestion(questions[index]);
        }
    }, [index, questions]);

    function handleAnswerChange(qIndex, value) {
        setAnswers((prev) => {
            const updated = [...prev];
            updated[qIndex] = {
                questionId: question.id,
                answer: value
            };

            return updated;
        });
    }

    function handlePrev() {
        if (index > 0) {
            setIndex((prev) => prev - 1);
        }
    }

    function handleNext() {
        if (index < questions.length - 1) {
            setIndex((prev) => prev + 1);
        }
    }

    async function handleSubmit() {
        console.log(answers);
        const res = await saveAnswers(id, answers);
        if (res.ok) {
            console.log("Answers saved! Redirecting to Dashboard!");
        } else {
            console.error("Failed to save answers:", res.message);
        }
    }

    function handleEndClick() {
        if (answers.length < questions.length) {
            alert("Are you sure you want to exit?");
            router.push("/dashboard");
            return;
        }

        saveAnswers(id, []);
    }

    return (
        <>
            <InterviewIntro />
            <main className="max-w-5xl h-screen m-auto flex flex-col items-center py-10 relative">
                {/* Prev Button */}
                {index > 0 && (
                    <button
                        onClick={handlePrev}
                        className="absolute flex items-center gap-2 lg:-left-24 md:left-10 rounded-full py-5 pe-20 p-5 bg-white/20 top-1/3 cursor-pointer hover:bg-white/30 transition-colors duration-500"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                        <span>Prev</span>
                    </button>
                )}

                {index < questions.length - 1 ? (
                    <button
                        onClick={handleNext}
                        className="absolute flex items-center gap-2 lg:-right-24 md:right-10 rounded-full py-5 ps-20 p-5 bg-white/20 top-1/3 cursor-pointer hover:bg-white/30 transition-colors duration-500"
                    >
                        <span>Next</span>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="absolute flex items-center gap-2 lg:-right-24 md:right-10 rounded-full py-5 ps-20 p-5 bg-black/80 top-1/3 cursor-pointer hover:bg-black transition-colors duration-500"
                        type="submit"
                    >
                        <span>Submit</span>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                )}

                {question && (
                    <Question
                        question={question}
                        currentIndex={index}
                        answers={answers}
                        onAnswerChange={handleAnswerChange}
                    />
                )}

            </main>
            <button onClick={handleEndClick} className="absolute top-5 right-5 py-2 px-5 bg-black/70 hover:bg-black cursor-pointer rounded-lg text-white">
                End Interview
            </button>
        </>
    );
};

export default Page;
