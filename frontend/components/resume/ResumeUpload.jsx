'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const router = useRouter();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        const validTypes = ['.pdf', '.doc', '.docx'];
        const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
        
        if (!validTypes.includes(fileExtension)) {
            setError('Please upload only PDF or DOCX files');
            setFile(null);
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            setFile(null);
            return;
        }

        setFile(selectedFile);
        setError('');
        setSuccess(false);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        setIsLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/analyze-resume', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Server error: ${response.status}`);
            }

            const result = await response.json();
            
            // Create unique ID
            const myId = 'analysis_' + Date.now();
            
            // Save to localStorage
            localStorage.setItem(myId, JSON.stringify(result));
            
            setSuccess(true);
            
            // Go to results after 1 second
            setTimeout(() => {
                router.push('/resume-results?id=' + myId);
            }, 1000);

        } catch (err) {
            setError(err.message || 'Upload failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setError('');
        setSuccess(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Analysis</h1>
                    <p className="text-gray-600">Upload your resume and get instant AI-powered feedback</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                    <form onSubmit={handleUpload} className="space-y-6">
                        
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                id="resume-file-input"
                                disabled={isLoading}
                            />
                            
                            <label htmlFor="resume-file-input" className="cursor-pointer block">
                                <div className="text-6xl mb-4">📄</div>
                                <p className="text-lg font-medium text-gray-900">
                                    {file ? file.name : 'Click to upload'}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">PDF, DOC, or DOCX (max 5MB)</p>
                            </label>
                        </div>

                        {file && !error && (
                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{file.name}</p>
                                        <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={handleReset} 
                                        disabled={isLoading}
                                        className="text-red-600 hover:text-red-800 font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm text-green-700">✅ Success! Redirecting...</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!file || isLoading}
                            className="w-full py-3 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 transition-colors font-medium"
                        >
                            {isLoading ? '⏳ Analyzing...' : '📤 Upload Resume for Analysis'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResumeUpload;
