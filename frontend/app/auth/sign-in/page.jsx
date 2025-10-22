"use client";

import { auth } from "@/firebase/client";
import { login } from "@/lib/actions/auth.action";
import { faInfo, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signInWithEmailAndPassword } from "firebase/auth";
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

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      if (!idToken) {
        setMessage({ text: "Sign In Failed! Please try again later." });
        return;
      }

      await login({ email, idToken });
      setMessage({type: "User logged in Succussfully"});
      setLoading(false);
      router.push("/");
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen min-w-screen">
      {/* Notification message */}
      {message.text && (
        <p
          className={`border absolute top-4 flex gap-2 justify-center items-center p-2 text-center rounded-xl text-sm ${message.type === "error"
            ? "text-red-200 bg-red-300/50"
            : "text-green-200 bg-green-300/50"
            }`}
        >
          <FontAwesomeIcon icon={faInfo} />
          {message.text}
        </p>
      )}

      {/* Signup form */}
      <form
        className="min-w-sm p-10 bg-white/10 rounded-xl m-auto flex gap-4 flex-col text-center"
        onSubmit={handleSubmit}
        method="POST"
      >
        <input
          className="p-2 border-b-2 border-neutral-500 focus-visible:border-neutral-300 outline-none"
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="p-2 border-b-2 border-neutral-500 focus-visible:border-neutral-300 outline-none"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="bg-black/50 p-2 px-5 mt-10 rounded-lg text-white cursor-pointer hover:text-black hover:bg-white/60 transition-colors duration-700"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign In"}
          {loading && <FontAwesomeIcon className="ml-2 animate-spin" icon={faSpinner} />}
        </button>

        <p className="text-sm">
          Don't have an account?{" "}
          <Link className="text-emerald-300 hover:text-emerald-700" href="/auth/sign-up">
            Sign Up
          </Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
