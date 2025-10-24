"use client";

import Toast from "@/components/Toast";
import { getCurrentUser, updateUserDetails } from "@/lib/actions/auth.action";
import { updateCurrentUser } from "firebase/auth";
import { useEffect, useState } from "react";

export default function page() {

	const [message, setMessage] = useState({text: "", type: "warning"});

	useEffect(() => {
		const timeout = setTimeout(() => {
			setMessage({text: "", type: "warning"});
		}, 5000);

		return () => {
			clearTimeout(timeout);
		}
	}, [message]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);

		const firstName = formData.get('firstName');
		const lastName = formData.get('lastName');
		const displayName = formData.get('displayName');

		if (!firstName || !lastName) {
			setMessage({
				text: "First Name and Last Name are required. Please enter all the details to continue!", 
				type: "error"
			})
		}

		const f = String(firstName).trim();
		const l = String(lastName).trim();
		const d = String(displayName ?? "").trim();

		const userInfo = {
			firstName: f,
			lastName: l,
			displayName: d || `${f} ${l}`
		};

		const user = await getCurrentUser();
		updateUserDetails(user.id, userInfo);
	}

	return (
		<>
			<Toast message={message.text} setMessage={setMessage} type={message.type} />

			<div className="min-h-screen min-w-screen flex">
				<div className="">please fill following details to continue</div>
				<form
					className='min-w-lg flex flex-col gap-5 border rounded-xl p-4 m-auto'
					method='POST'
					onSubmit={handleSubmit}
				>
					<div className="border p-5 border-neutral-300">
						<label htmlFor="username">Choose a unique Username: </label>
						<input className='border-b outline-none' type="text" name="username" required id="username" />
						<div className="">
							
						</div>
					</div>
					<div className="border p-5 border-neutral-300">
						<label htmlFor="firstName">First Name: </label>
						<input className='border-b outline-none' type="text" name="firstName" required id="firstName" />
					</div>
					<div className="border p-5 border-neutral-300">
						<label htmlFor="lastName">Last Name: </label>
						<input className='border-b outline-none' type="text" name="lastName" required id="lastName" />
					</div>
					<div className="border p-5 border-neutral-300">
						<label htmlFor="displayName">Display Name: </label>
						<input className='border-b outline-none' type="text" name="displayName" id="displayName" />
						<p className="text-sm p-3 opacity-50">FirstName + LastName is used if not specified</p>
					</div>
					<button className='cursor-pointer border p-2 mt-10 transition-colors duration-500 hover:bg-black hover:text-white rounded-xl' type="submit">
						Next
					</button>
				</form>
			</div>
		</>
	)
}
