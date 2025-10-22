"use client";

import { signout } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

export default function LogoutButton() {
    // const router = useRouter();

    const handleLogout = async () => {
        signout();
        redirect("/auth/sign-in");
    }

    return (
        <button className='block text-center cursor-pointer mr-10' onClick={handleLogout}>
            Logout
        </button>
    )
}
