"use client";

import Toast from "@/components/Toast";
import { auth } from "@/firebase/client";
import { getCurrentUser, login } from "@/lib/actions/auth.action";
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

		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);
			const idToken = await userCredential.user.getIdToken();
	
			if (!idToken) {
				setMessage({ text: "Sign In Failed! Please try again later." });
				return;
			}
	
			const res = await login({ email, idToken });

			if (res.success) {
				setMessage({text: res.message, type: "success"});
			}	

			if (!(await getCurrentUser()).username) {
				router.push("/details");
				return;
			}

			router.push("/dashboard");
		} catch (e) {
			setLoading(false);
			
			if (e.code === "auth/invalid-credential") {
				setMessage({text: "The credentials entered are invalid or the user does not exist. Please check and try again!"})
			}
			console.log("there was an error", e);
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
					className="bg-black/50 p-2 px-5 mt-10 rounded-lg text-white cursor-pointer hover:text-black hover:bg-white/60 disabled:hover:opacity-50 disabled:bg-neutral-500 transition-colors duration-700"
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
