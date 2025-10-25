"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signup } from "@/lib/actions/auth.action";
import Toast from "@/components/Toast";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (!message.text) return;
    const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  // Handle email/password signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Firebase signup
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Call your backend signup action
      const res = await signup({
        uid: userCredential.user.uid,
        email,
        password
      });

      if (!res.success) {
        setMessage({ text: res.message || "Signup failed!", type: "error" });
        return;
      }

      setMessage({ text: res.message || "Account created successfully!", type: "success" });

      // Delay redirect slightly so the user can see the message
      setTimeout(() => router.push("/auth/sign-in"), 1500);

    } catch (e) {
      if (e.code === "auth/email-already-in-use") {
        console.log("A User already exists with this email. Please sign in");
        setMessage({ text: "A user already exists with this email!", type: "error" });
        return;
      }
      console.log("There was an error while Signing up the user", e);
      setMessage({ text: "Some error occurred!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen min-w-screen">
      {/* Notification message */}
      <Toast message={message.text} setMessage={setMessage} type={message.type} />

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
          {loading ? "Signing Up..." : "Sign Up"}
          {loading && <FontAwesomeIcon className="ml-2 animate-spin" icon={faSpinner} />}
        </button>

        {/* Optional Google sign-in (uncomment when ready) */}
        {/*
        <div className="text-sm font-bold">Or</div>
        <button
          className="bg-black/50 p-2 px-5 rounded-lg text-white cursor-pointer hover:text-black hover:bg-white/60 transition-colors duration-700"
          type="button"
          disabled={loading}
          onClick={handleGoogleSignup}
        >
          <FontAwesomeIcon className="mr-4" icon={faGoogle} />
          <span>Sign up with Google</span>
          {loading && <FontAwesomeIcon className="ml-2 animate-spin" icon={faSpinner} />}
        </button>
        */}

        <p className="text-sm">
          Already have an account?{" "}
          <Link className="text-emerald-300 hover:text-emerald-700" href="/auth/sign-in">
            Sign In
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Signup;
