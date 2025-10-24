"use client";

import { signout } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

export default function LogoutButton() {

    const handleLogout = async () => {
        signout();
        redirect("/auth/sign-in");
    }

    return (
        <button className='block text-center bg-red-300 p-2 px-5 rounded-lg cursor-pointer mr-10' onClick={handleLogout}>
            Logout
        </button>
    )
}
