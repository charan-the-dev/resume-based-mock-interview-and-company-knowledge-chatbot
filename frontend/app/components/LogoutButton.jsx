"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        const res = await fetch("/api/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);
        } else {
            console.log(data);
        }
    }

    return (
        <button className='block text-center mr-10' onClick={handleLogout}>
            <Link href="/auth/login">
                Logout
            </Link>
        </button>
    )
}
