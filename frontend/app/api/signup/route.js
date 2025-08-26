import { NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { encryptPassword } from "@/app/lib/encrypt";
import { setSession } from "@/app/lib/session";

export async function POST(req) {
    await connectDB();
    try {
        const { username, email, password } = await req.json();

        if (!password || password.length <= 6) {
            return NextResponse.json({ message: "The password's length should be greater than 6 characters" }, { status: 400 });
        }

        const existingUsername = await User.findOne({ username });
        console.log("existingUsername: " + existingUsername);

        if (existingUsername) {
            return NextResponse.json({ message: "A user with the username already exists" }, { status: 409 })
        }

        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return NextResponse.json({ message: "A user with the email already exists" }, { status: 409 })
        }

        const hashedPassword = encryptPassword(password);

        const user = await User.create({ username, email, password: hashedPassword });

        await setSession({ userId: user._id.toString(), username: user.username, email: user.email });

        return NextResponse.json({
            message: "A new user is created !.",
            user: {
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            },
        }, { status: 201 });

    } catch (err) {
    console.error("signup error:", err);

    // if duplicate key error from Mongo unique index, return 409
    if (err?.code === 11000) {
      return NextResponse.json({ message: "Duplicate key error" }, { status: 409 });
    }
        
        return NextResponse.json(
      { message: "There was an error creating the user" },
            { status: 500 }
        );
    }
}
