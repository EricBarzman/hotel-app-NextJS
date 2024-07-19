import { getRoomReviews } from "@/libs/apis";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string }}
) {
    const roomId = params.id;

    try {
        const roomReviews = await getRoomReviews(roomId);
        return NextResponse.json(roomReviews, {
            status: 200,
            statusText: "Successful"
        }) 

    } catch(error) {
        console.log("Failed getting reviews", error);
        return new NextResponse("Unable to fetch reviews data", { status : 400 });
        
    }
}