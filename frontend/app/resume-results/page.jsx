'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ResumeResultsPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get result from localStorage
        if (id) {
            const savedResult = localStorage.getItem(id);
            if (savedResult) {
                setResult(JSON.parse(savedResult));
            }
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-900 to-black">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                    <p className="text-emerald-200">Loading results...</p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-900 to-black">
                <div className="text-center">
                    <p className="text-red-400 text-xl mb-4">No results found</p>
                    <Link href="/resume-upload" className="text-emerald-300 hover:underline">
                        Upload a new resume
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-emerald-900 to-black text-emerald-100">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="bg-black/50 backdrop-blur-sm border border-black/30 rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-emerald-100 mb-2">
                        Resume Analysis Results
                    </h1>
                    <p className="text-emerald-200">
                        AI-powered analysis of your resume
                    </p>
                </div>

                {/* Overall Score */}
                <div className="rounded-lg shadow-lg p-8 mb-6" style={{ background: 'linear-gradient(90deg, rgba(6,95,70,0.95), rgba(4,77,64,0.95))', color: 'white' }}>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">Overall Score</h2>
                        <div className="text-6xl font-bold mb-2">
                            {result.overall_score.toFixed(1)}
                        </div>
                        <div className="text-xl">out of 100</div>
                    </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Hard Score */}
                    <div className="bg-black/40 backdrop-blur-sm border border-black/25 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-emerald-100 mb-4">
                            Hard Score
                        </h3>
                        <div className="text-4xl font-bold text-emerald-300 mb-4">
                            {result.hard_score.total_score}/100
                        </div>
                        <div className="space-y-2 text-emerald-100">
                            <div className="flex justify-between">
                                <span className="text-emerald-200">Contact Info:</span>
                                <span className="font-semibold">{result.hard_score.contact_completeness}/10</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-emerald-200">Education:</span>
                                <span className="font-semibold">{result.hard_score.education_score}/25</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-emerald-200">Experience:</span>
                                <span className="font-semibold">{result.hard_score.experience_score}/30</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-emerald-200">Skills:</span>
                                <span className="font-semibold">{result.hard_score.skills_score}/25</span>
                            </div>
                        </div>
                    </div>

                    {/* Soft Score */}
                    <div className="bg-black/40 backdrop-blur-sm border border-black/25 rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-bold text-emerald-100 mb-4">
                            Soft Score
                        </h3>
                        <div className="text-4xl font-bold text-emerald-200 mb-4">
                            {result.soft_score.total_score}/100
                        </div>
                        <div className="space-y-2 text-emerald-100">
                            <div className="flex justify-between">
                                <span className="text-emerald-200">Readability:</span>
                                <span className="font-semibold">{result.soft_score.readability_score}/25</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-emerald-200">Keywords:</span>
                                <span className="font-semibold">{result.soft_score.keyword_density}/25</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-emerald-200">Formatting:</span>
                                <span className="font-semibold">{result.soft_score.formatting_score}/25</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-emerald-200">Length:</span>
                                <span className="font-semibold">{result.soft_score.length_score}/25</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Suggestions */}
                <div className="bg-black/50 backdrop-blur-sm border border-black/30 rounded-lg shadow-md p-6 mb-6 text-emerald-100">
                    <h3 className="text-2xl font-bold mb-6">
                        AI Suggestions
                    </h3>

                    {/* Strengths */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-emerald-300 mb-3">
                            Strengths
                        </h4>
                        <ul className="space-y-2">
                            {result.llm_suggestions.strengths.map((strength, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-emerald-300 mr-2">●</span>
                                    <span className="text-emerald-100">{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Improvements */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-amber-400 mb-3">
                            Areas for Improvement
                        </h4>
                        <ul className="space-y-2">
                            {result.llm_suggestions.improvements.map((improvement, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-amber-400 mr-2">●</span>
                                    <span className="text-emerald-100">{improvement}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Action Items */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-emerald-300 mb-3">
                            Action Items
                        </h4>
                        <ul className="space-y-2">
                            {result.llm_suggestions.action_items.map((item, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-emerald-300 mr-2">●</span>
                                    <span className="text-emerald-100">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ATS Tips */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-emerald-300 mb-3">
                            ATS Optimization Tips
                        </h4>
                        <ul className="space-y-2">
                            {result.llm_suggestions.ats_tips.map((tip, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-emerald-300 mr-2">●</span>
                                    <span className="text-emerald-100">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Assessment */}
                    <div className="bg-black/30 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-emerald-100 mb-2">
                            Overall Assessment
                        </h4>
                        <p className="text-emerald-200">{result.llm_suggestions.assessment}</p>
                    </div>
                </div>

                {/* Parsed Content */}
                <div className="bg-black/50 backdrop-blur-sm border border-black/30 rounded-lg shadow-md p-6 mb-6 text-emerald-100">
                    <h3 className="text-2xl font-bold mb-4">
                        Parsed Content
                    </h3>
                    
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-emerald-200">Name:</h4>
                            <p className="text-emerald-100">{result.parsed_content.personal_info.name}</p>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold text-emerald-200">Contact:</h4>
                            <p className="text-emerald-100">
                                {result.parsed_content.contact.email} | {result.parsed_content.contact.phone}
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold text-emerald-200">Skills:</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {result.parsed_content.skills.map((skill, index) => (
                                    <span key={index} className="bg-black/20 text-emerald-200 px-3 py-1 rounded-full text-sm border border-black/20">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <Link 
                        href="/resume-upload"
                        className="flex-1 bg-emerald-600 text-black py-3 px-6 rounded-lg text-center font-semibold hover:bg-emerald-500 transition-colors"
                    >
                        Upload Another Resume
                    </Link>
                    <Link 
                        href="/"
                        className="flex-1 bg-black/40 text-emerald-200 py-3 px-6 rounded-lg text-center font-semibold hover:bg-black/30 transition-colors border border-black/25"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
