import { db } from "@/firebase/admin";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const id = params.id;

    const interview = await db.collection("interviews").doc(id).get();

    if (!interview.exists) {
        return NextResponse.json({
            success: false,
            message: "Invalid Interview Id. There is no interview with the Interview Id!",
            interview: null
        })
    }

    return NextResponse.json({
        message: "Fetching request is successfull",
        interview: interview.data(),
        success: true,
    });
}