import { doesInterviewExist } from '@/lib/actions/interview.action'

export default async function layout({ children, params }) {
    const { id } = await params;

    if (!(await doesInterviewExist(id))?.success) {
        return <div className='h-screen w-screen flex justify-center items-center text-3xl'>
            There is no interview with this Interview Id {id}. Please check again!
        </div>
    }

    return (
        <>
            {children}
        </>
    )
}
