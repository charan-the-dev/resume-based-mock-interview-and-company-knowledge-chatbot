import LogoutButton from "@/components/LogoutButton";
import { getCurrentUser, isAuthenticated } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

export default async function page({ children }) {
    const userRecord = await getCurrentUser();
    console.log(userRecord);

    if (!isAuthenticated()) {
        redirect("/auth/sign-in");
    }

    return (
        <>
            <header className='flex justify-end p-3'>
                <LogoutButton />
            </header>
            {children}
        </>
    )
}
