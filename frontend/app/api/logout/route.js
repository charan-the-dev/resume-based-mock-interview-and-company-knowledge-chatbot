import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
    const cookieStore = cookies()

    // Remove all authentication related cookies
    cookieStore.delete('session_token')

    return NextResponse.json(
        { message: 'Logged out successfully' },
        { status: 200 }
    )
}