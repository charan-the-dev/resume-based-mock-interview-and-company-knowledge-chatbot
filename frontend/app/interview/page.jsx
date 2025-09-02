"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const totalTime = 4820; // 1hr 20min 20s
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      q: "Which class provides system independent server side implementation?",
      options: ["Server", "ServerReader", "Socket", "ServerSocket"],
    },
    {
      q: "Which keyword is used to inherit a class in Java?",
      options: ["this", "super", "extends", "implements"],
    },
    {
      q: "Which collection in Java does not allow duplicate elements?",
      options: ["List", "Set", "Map", "Queue"],
    },
    {
      q: "Which of these is not a Java access modifier?",
      options: ["public", "protected", "private", "internal"],
    },
    {
      q: "Which SQL command is used to remove a table from a database?",
      options: ["DELETE", "REMOVE", "DROP", "TRUNCATE"],
    },
    {
      q: "What does JVM stand for?",
      options: [
        "Java Virtual Machine",
        "Java Visual Manager",
        "Java Variable Method",
        "Java Verified Module",
      ],
    },
    {
      q: "Which operator is used for logical AND in Java?",
      options: ["&", "&&", "||", "!"],
    },
    {
      q: "Which of the following is not part of OOPS?",
      options: ["Encapsulation", "Inheritance", "Polymorphism", "Compilation"],
    },
    {
      q: "Which method is called when an object is created in Java?",
      options: ["start()", "main()", "constructor", "init()"],
    },
    {
      q: "Which protocol is used to send emails?",
      options: ["FTP", "SMTP", "HTTP", "SNMP"],
    },
    {
      q: "Which of these is not a type of join in SQL?",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "TOP JOIN"],
    },
    {
      q: "Which keyword is used to prevent inheritance in Java?",
      options: ["super", "const", "final", "static"],
    },
    {
      q: "Which data structure works on FIFO?",
      options: ["Stack", "Queue", "Tree", "Graph"],
    },
    {
      q: "Which of these is a NoSQL database?",
      options: ["MySQL", "MongoDB", "Oracle", "PostgreSQL"],
    },
    {
      q: "Which Java package contains Scanner class?",
      options: ["java.util", "java.io", "java.sql", "java.lang"],
    },
    {
      q: "Which sorting algorithm is fastest in average case?",
      options: [
        "Bubble Sort",
        "Quick Sort",
        "Insertion Sort",
        "Selection Sort",
      ],
    },
    {
      q: "Which annotation is used in JUnit for test methods?",
      options: ["@Run", "@Check", "@Test", "@Unit"],
    },
    {
      q: "Which of these is used to connect Java with databases?",
      options: ["JDBC", "ODBC", "SOAP", "JSON"],
    },
    {
      q: "Which of the following is not a Java primitive type?",
      options: ["int", "float", "boolean", "string"],
    },
    {
      q: "What is the default value of a boolean variable in Java?",
      options: ["true", "false", "0", "null"],
    },
  ];

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

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
    <div className="min-h-screen bg-[#0f332b] text-white flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-[#739679] px-6 py-4">
        <h1 className="font-bold text-2xl">Answerly</h1>
        {/* <div className="text-lg">Time left: {formatTime(timeLeft)}</div> */}
        <button className="bg-[#4d0c0c] px-4 py-2 rounded-lg hover:bg-red-900">
          Exit
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="h-full relative flex flex-1 p-6 space-x-6">
        {/* QUESTION BOX */}
        <div className="flex flex-col justify-between flex-1 bg-[#123d32] p-6 rounded-lg">
          <div>
            <p className="text-lg font-semibold mb-4">
              {currentQ + 1}Q. {questions[currentQ].q}
            </p>
            <ul className="space-y-3">
              {questions[currentQ].options.map((opt, i) => (
                <li key={i}>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`q${currentQ}`}
                      checked={answers[currentQ] === opt}
                      onChange={() => handleAnswer(currentQ, opt)}
                    />
                    <span>{opt}</span>
                  </label>
                </li>
              ))}
            </ul>

            <div className="text-9xl opacity-10 absolute bottom-4 right-4 select-none pointer-events-none">
              01
            </div>
            <div className="mt-6 text-center font-semibold">
                Question {currentQ + 1} of {questions.length}
              </div>
          </div>

          <button
            className="w-fit bg-[#2c5e52] px-5 py-2 rounded-lg hover:bg-[#1e4039]"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>

        {/* SIDEBAR */}
        <div className="w-64 bg-[#123d32] p-6 rounded-lg">
          <h3 className="mb-4 font-semibold">SECTION A</h3>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-12 h-12 flex items-center justify-center rounded-md cursor-pointer
                  ${
                    currentQ === i
                      ? "bg-black"
                      : answers[i]
                      ? "bg-green-600"
                      : "bg-[#3e5b4c]"
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
              className="bg-[#2c5e52] px-3 py-2 rounded hover:bg-[#1e4039]"
            >
              &lt;
            </button>
            <button className="bg-[#48634e] px-3 py-2 rounded hover:bg-[#2d4735]">
              save
            </button>
            <button
              onClick={() =>
                setCurrentQ((p) => (p < questions.length - 1 ? p + 1 : p))
              }
              className="bg-[#2c5e52] px-3 py-2 rounded hover:bg-[#1e4039]"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
