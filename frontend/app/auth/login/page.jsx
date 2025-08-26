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
    <div className="relative min-h-screen flex items-center justify-center">
      {message && message.text && (
        <p className={`border absolute top-0 flex justify-center items-center gap-3 p-2 text-center rounded-xl text-sm mt-4 ${message.type === "error" ? "text-red-200 bg-red-300/50" : "text-green-200 bg-green-300/50"}`}>
          <Info className="text-red-50" size={25} strokeWidth={1.5} />
          {message.text}
        </p>
      )}
      <div className="bg-neutral-700 p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form
          className="flex flex-col gap-5 items-center justify-center"
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
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50 hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
            <span className='ml-3 animate-spin'>{loading && <Loader />}</span>
          </button>
          <button className="w-full" disabled={loading}>
            <Link
              href="/auth/signup"
              className="block text-center w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Sign Up
            </Link>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
