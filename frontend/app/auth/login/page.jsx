"use client";

import { Info, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!message || !message.text) return;
    const timer = setTimeout(() => setMessage({ text: "", type: "refresh" }), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setMessage({ text: "The Email and Password are invalid or empty", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: data.message || "Login Successful", type: "success" });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setMessage({ text: data.message || "Login Failed", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "An error occurred.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f2b29] overflow-hidden">
      {/* Background circles for glassmorphism effect */}
      <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-[#77e6da] opacity-40 blur-3xl"></div>
      <div className="absolute -right-10 top-1/4 h-60 w-60 rounded-full bg-[#a3ffd6] opacity-30 blur-2xl"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-80 w-80 rounded-full bg-[#245e56] opacity-50 blur-3xl"></div>

      {message && message.text && (
        <p
          className={`border absolute top-5 flex justify-center items-center gap-3 p-3 text-center rounded-xl text-sm z-20 shadow-lg ${
            message.type === "error"
              ? "text-red-200 bg-red-300/50 backdrop-blur-md"
              : "text-green-200 bg-green-300/50 backdrop-blur-md"
          }`}
        >
          <Info className="text-white" size={20} strokeWidth={1.5} />
          {message.text}
        </p>
      )}

      {/* Glass card */}
      <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-sm border border-white/20 z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Login</h2>

        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
          method="POST"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="flex items-center justify-center w-full bg-cyan-500 text-white py-2 rounded-lg font-medium hover:bg-cyan-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
            <span className="ml-3 animate-spin">{loading && <Loader />}</span>
          </button>
          <Link
            href="/auth/signup"
            className="block text-center w-full bg-white/20 text-white py-2 rounded-lg hover:bg-white/30 transition"
          >
            Sign Up
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
