import { isAuthenticated } from "@/lib/actions/auth.action"
import { redirect } from "next/navigation"
import ResumeUpload from '@/components/resume/ResumeUpload'
import LogoutButton from "@/components/LogoutButton"

export default async function ResumeUploadPage() {
  const isUserAuthenticated = await isAuthenticated();
  
  if (!isUserAuthenticated) {
    redirect("/auth/sign-in");
  }

  return (
    <>
      <header className='flex justify-between items-center bg-neutral-700 p-3'>
        <h1 className='text-white text-xl font-semibold ml-4'>Resume Analyzer</h1>
        <LogoutButton />
      </header>
      
      <ResumeUpload />
    </>
  )
}
