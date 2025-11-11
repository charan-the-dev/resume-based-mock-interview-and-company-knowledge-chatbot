"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useParams } from "next/navigation";
import { getAnalysis } from "@/lib/actions/interview.action";

// 🎨 Chart colors (emerald + pink + neutral)
const COLORS = ["#4af2c6", "#3ddbb4", "#2fb09a", "#F24A76", "#d93d67", "#111827"];

export default function InterviewDashboard() {
  const { id } = useParams();
  const [analysisData, setAnalysisData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧩 Mock fallback data (text + MCQs)
  const fallbackData = [
    // 🧠 Text-based questions
    {
      question: "What is React?",
      answer: "A JS library for building UIs.",
      evaluation: "Good understanding.",
      score: 8.5,
      feedback: "Could mention virtual DOM.",
      relatedSkill: "React",
    },
    {
      question: "Explain the concept of closures in JS.",
      answer:
        "A closure gives access to the outer function’s scope from an inner function.",
      evaluation: "Strong explanation.",
      score: 9,
      feedback: "Clear and concise.",
      relatedSkill: "JavaScript",
    },

    // 🧩 MCQ (Single Correct)
    {
      question: "Which of the following is a JavaScript framework?",
      answer: ["React"],
      options: ["React", "Laravel", "Django", "Flask"],
      evaluation: "Correct choice.",
      score: 9,
      feedback: "Excellent.",
      relatedSkill: "JavaScript",
    },
    {
      question: "Which of these is a CSS preprocessor?",
      answer: ["Sass"],
      options: ["Bootstrap", "Sass", "React", "Express"],
      evaluation: "Correct.",
      score: 8,
      feedback: "Good answer.",
      relatedSkill: "CSS",
    },

    // 🧩 MCQ (Multiple Correct)
    {
      question: "Which of these are frontend frameworks?",
      answer: ["React", "Vue"],
      options: ["React", "Vue", "Laravel", "Flask"],
      evaluation: "Excellent selection.",
      score: 9.5,
      feedback: "Perfect answer.",
      relatedSkill: "Frontend",
    },
    {
      question: "Select correct statements about JavaScript.",
      answer: ["It’s dynamic", "It’s single-threaded"],
      options: [
        "It’s compiled",
        "It’s dynamic",
        "It’s single-threaded",
        "It runs only on servers",
      ],
      evaluation: "Good understanding.",
      score: 8,
      feedback: "Missed event loop mention.",
      relatedSkill: "JavaScript",
    },
  ];

  // 🔹 Simulate backend data fetch
  useEffect(() => {
    const loadAnalysis = async () => {
      setLoading(true);
      try {
        // simulate delay for loading state
        await new Promise((r) => setTimeout(r, 1000));
        // Normally you'd call: const result = await getAnalysis(id);
        setAnalysisData(fallbackData);
      } catch (err) {
        console.error("Error fetching analysis:", err);
        setAnalysisData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [id]);

  // 🧮 Derived metrics
  const overallScore = useMemo(() => {
    if (!analysisData.length) return 0;
    return (
      analysisData.reduce((sum, q) => sum + (q.score || 0), 0) /
      analysisData.length
    ).toFixed(1);
  }, [analysisData]);

  // 🔹 Split MCQs and text answers
  const mcqQuestions = analysisData.filter((q) => Array.isArray(q.answer));
  const textQuestions = analysisData.filter((q) => typeof q.answer === "string");

  const mcqSingle = mcqQuestions
    .filter((q) => q.answer.length === 1)
    .map((q) => ({ name: q.question, value: q.score }));

  const mcqMultiple = mcqQuestions
    .filter((q) => q.answer.length > 1)
    .map((q) => ({ name: q.question, value: q.score }));

  const barData = textQuestions.map((q) => ({
    name: q.relatedSkill || q.question.slice(0, 15) + "...",
    score: q.score,
  }));

  const overallPieData = [
    { name: "Achieved", value: Number(overallScore) },
    { name: "Remaining", value: 10 - Number(overallScore) },
  ];

  // 🕐 Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg">
        Loading interview analysis...
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-4xl font-bold text-center mb-4">
        🧭 Interview Performance Dashboard
      </h1>

      <Separator />

      {/* 🧩 Dashboard Grid Layout - 2 per row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 🔹 Overall Score */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle>Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center relative">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={overallPieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  label
                >
                  {overallPieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-semibold">
              {overallScore}/10
            </div>
          </CardContent>
        </Card>

        {/* 🔹 MCQ (Single Correct) */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle>MCQ (Single Correct)</CardTitle>
          </CardHeader>
          <CardContent>
            {mcqSingle.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={mcqSingle}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {mcqSingle.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">No single MCQ data</p>
            )}
          </CardContent>
        </Card>

        {/* 🔹 MCQ (Multiple Correct) */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle>MCQ (Multiple Correct)</CardTitle>
          </CardHeader>
          <CardContent>
            {mcqMultiple.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={mcqMultiple}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {mcqMultiple.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">No multiple MCQ data</p>
            )}
          </CardContent>
        </Card>

        {/* 🔹 Text-Based Answers */}
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle>Text-Based Answers — Rating by Skill</CardTitle>
          </CardHeader>
          <CardContent>
            {barData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#4af2c6" name="Score (0–10)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center">No text-based data</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
