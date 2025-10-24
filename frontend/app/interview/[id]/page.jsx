"use client";

import { useParams } from "next/navigation";

const page = () => {
    const {id} = useParams();
    return (
        <div>The Interview Id is: {id}</div>
    )
}

export default page