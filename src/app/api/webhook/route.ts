import { createBooking, updateHotelRoom } from "@/libs/apis";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const checkout_session_completed = "checkout.session.completed";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-06-20'    
});

export async function POST(req: Request, res: Response) {
    const reqBody = await req.text();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
        if (!signature || !webhookSecret) return;
        event = stripe.webhooks.constructEvent(reqBody, signature, webhookSecret);

    } catch(error: any) {
        return new NextResponse(`Webhook error: ${error.message}`, { status: 500 });
    }

    // Load event
    switch(event.type) {

        case checkout_session_completed:
            const session = event.data.object;
            
            // Create booking
            const {
                metadata : {
                    // @ts-ignore
                    adults, children, checkinDate, checkoutDate, hotelRoom, user, totalPrice, numberOfDays, discount
                },
            } = session;

            await createBooking({
                adults: Number(adults),
                checkinDate,
                checkoutDate,
                children: Number(children),
                hotelRoom,
                numberOfDays: Number(numberOfDays),
                discount: Number(discount),
                totalPrice: Number(totalPrice),
                user,
            })

            // Update hotel Room
            await updateHotelRoom(hotelRoom);

            return NextResponse.json("Booking successful", {
                status: 200,
                statusText: "Booking successful"
            })

        default:
            console.log(`Unhandled event type ${event.type}`);
                        
    }

    return NextResponse.json("Event received", {
        status: 200,
        statusText: "Event received"
    })
}