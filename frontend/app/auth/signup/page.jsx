"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Info, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!message || !message.text) return;
    const timer = setTimeout(() => { setMessage({ text: "", type: "error" }) }, 5000);
    setLoading(false);

    return () => clearTimeout(timer);
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ text: data.message || "Sign Up successful!", type: "success" });
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setMessage({ text: data.message || "Sign Up Failed", type: "error" });
        console.log(data);
      }

    } catch (error) {
      console.error(error);
      setMessage({ text: "Some error occurred!", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex  flex-col items-center justify-center min-h-screen min-w-screen">
      {message && message.text && (
        <p className={`border absolute top-0 flex justify-center items-center gap-3 p-2 text-center rounded-xl text-sm mt-4 ${message.type === "error" ? "text-red-200 bg-red-300/50" : "text-green-200 bg-green-300/50"}`}>
          <Info className="text-red-50" size={25} strokeWidth={1.5} />
          {message.text}
        </p>
      )}
      <h2 className='text-center pt-25 text-5xl uppercase'>Sign Up</h2>
      <form
        className='min-w-sm p-10 bg-neutral-700 rounded-3xl m-auto mt-15 flex gap-4 flex-col text-center'
        onSubmit={handleSubmit}
        method='POST'
      >
        <input
          className='p-2 border-b-2 border-neutral-500 focus-visible:border-neutral-300 outline-none'
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className='p-2 border-b-2 border-neutral-500 focus-visible:border-neutral-300 outline-none'
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className='p-2 border-b-2 border-neutral-500 focus-visible:border-neutral-300 outline-none'
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className='flex items-center justify-center bg-emerald-300 p-2 mt-10 rounded-lg text-emerald-800 font-bold cursor-pointer hover:text-emerald-100 hover:bg-emerald-800 transition-colors duration-700'
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign Up"}
          <span className='ml-3 animate-spin'>{loading && <Loader />}</span>
        </button>
        <button onClick={() => router.push("/auth/login")} disabled={loading}>
          <Link
            href={"/auth/login"}
            className='block text-center w-full bg-emerald-800 p-2 rounded-lg text-emerald-100 font-bold cursor-pointer hover:text-emerald-800 hover:bg-emerald-300 transition-colors duration-700'
          >
            Login
          </Link>
        </button>
      </form>
    </main>
  );
};

export default Signup;
