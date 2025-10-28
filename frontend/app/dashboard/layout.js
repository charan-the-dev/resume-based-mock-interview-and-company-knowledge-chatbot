import LogoutButton from "@/components/LogoutButton";
import { getCurrentUser, isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

export default async function page({ children }) {
    if (!isAuthenticated()) {
        redirect("/auth/sign-in");
    }

    const user = await getCurrentUser();

    return (
        <>
            <header className='flex justify-between p-3'>
                <div className="text-2xl">Hallo! 👋🏼, {user.username}</div>
                <LogoutButton />
            </header>
            {children}
        </>
    )
}
