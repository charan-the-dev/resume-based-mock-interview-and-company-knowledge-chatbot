import { isAuthenticated } from "@/lib/actions/auth.action"
import LogoutButton from "../components/LogoutButton"
import { redirect } from "next/navigation"

export default async function page() {
  const isUserAuthenticated = await isAuthenticated();
  
  if (!isUserAuthenticated) {
    redirect("/auth/sign-in");
  }

  return (
    <>
      <header className='flex justify-end bg-neutral-700 p-3'>
        <LogoutButton />
      </header>
      <main className='mt-30 flex m-auto gap-5 justify-center items-center text-4xl uppercase'>

        Home page <u>comes Here</u>
      </main>
    </>
  )
}
