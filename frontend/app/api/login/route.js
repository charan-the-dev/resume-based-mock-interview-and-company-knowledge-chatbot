import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { verifyPassword } from "@/app/lib/encrypt";
import { setSession } from "@/app/lib/session";

export async function POST(req) {
    await connectDB();
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "The Email and Password fields are not reaching to Server !" },
                { status: 400 }
            )
        }

        const user = await User.findOne({ email });
        console.log(user);

        if (!user) {
            return NextResponse.json(
                { message: "The Email does not exist. Please Sign Up first!" },
                { status: 400 }
            )
        }

        const isPasswordCorrect = verifyPassword(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json(
                { message: "Incorrect Password. Recheck the password to Login!" },
                { status: 400 }
            )
        }

        await setSession({ userId: user._id.toString(), username: user.username, email: user.email });

        return NextResponse.json(
            { message: "The Login is Successfull! Enjoy your time on our Website ☺️" }
        )

    } catch (e) {
        return NextResponse.json(
            {
                message: "There was some Error Loging in !",
                error: e.stack
            },
            { status: 500 }
        );
    }
}