import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { NextResponse } from "next/server";
import { checkIfReviewExists, CreateReview, getUserData, updateReview } from "@/libs/apis";

export async function GET(req: Request, res: Response) {
    const session = await getServerSession(authOptions);
    if (!session)
        return new NextResponse("Authentication required", { status: 500 });

    const userId = session.user.id;

    try {
        const data = await getUserData(userId)
        return NextResponse.json(data, { status : 200, statusText: 'Successful' });
        
    } catch(error) {
        return new NextResponse("Unable to fetch user data", { status : 400 })
    }
}

export async function POST(req: Request, res: Response) {
    const session = await getServerSession(authOptions);
    if (!session)
        return new NextResponse("Authentication required", { status: 500 });

    const { roomId, reviewText, userRating } = await req.json();
    
    if (!roomId || !reviewText || !userRating)
        return new NextResponse("You need to fill all fields", { status: 400 });

    const userId = session.user.id;

    try {
        // Check if review already exists
        const reviewAlreadyExists = await checkIfReviewExists(userId, roomId);
        let data;
        
        if (reviewAlreadyExists) {
            data = await updateReview({ reviewId: reviewAlreadyExists._id, reviewText, userRating});

        } else {
            data = await CreateReview({
                hotelRoomId: roomId,
                reviewText,
                userId,
                userRating
            });
        }

        return NextResponse.json(data, { status: 200, statusText: "Successful" })

    } catch(error:any) {
        console.log("Error: ", error);
        return new NextResponse("Unable to create review", { status: 400});
    }
}