import { CreateBookingDto, Room } from "@/models/room";
import sanityClient from "./sanity";
import * as queries from "./sanityQueries";
import axios from "axios";
import { Booking } from "@/models/booking";
import { CreateReviewDto, Review, UpdateReviewDto } from "@/models/review";

export async function getFeaturedRoom() {
    return await sanityClient.fetch<Room>(
        queries.getFeaturedRoomQuery,
        {},
        { cache: 'no-cache' },
    );
}

export async function getRooms() {
    return await sanityClient.fetch<Room[]>(
        queries.getRoomsQuery,
        {},
        { cache: 'no-cache' }
    );
}

export async function getRoom(slug: string) {
    return await sanityClient.fetch<Room>(
        queries.getRoomQuery,
        { slug },
        { cache: 'no-cache' }
    )
}

export async function createBooking({
    adults,
    children,
    checkinDate,
    checkoutDate,
    discount,
    hotelRoom,
    totalPrice,
    numberOfDays,
    user
} : CreateBookingDto) {

    const mutation = {
        mutations: [
            {
                create : {
                    _type: "booking",
                    user: {
                        _type: 'reference',
                        _ref: user
                    },
                    hotelRoom: {
                        _type: 'reference',
                        _ref: hotelRoom
                    },
                    checkinDate,
                    checkoutDate,
                    adults,
                    children,
                    totalPrice,
                    discount,
                    numberOfDays
                }
            }
        ]
    };

    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        { 
            headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` }
        }
    );

    return data;
}

export async function updateHotelRoom(hotelRoomId: string) {
    const mutation = {
        mutations: [
            {
                patch: {
                    id: hotelRoomId,
                    set: {
                        isBooked: true
                    }
                }
            }
        ]
    }

    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        { 
            headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` }
        }
    );

    return data;
}

export async function getUserBookings(userId: string) {
    return await sanityClient.fetch<Booking[]>(
        queries.getUserBookingsQuery,
        { userId },
        { cache: 'no-cache' }
    );
}

export async function getUserData(userId: string) {
    return await sanityClient.fetch(
        queries.getUserDataQuery,
        { userId },
        { cache: 'no-cache' }
    );
}

export async function checkIfReviewExists(userId: string, hotelRoomId: string): Promise<null | {_id : string }> {
    const query = `*[_type == 'review' && user._ref == $userId && hotelRoom._ref == $hotelRoomId][0] {
        _id,
    }`;
    const params = { userId, hotelRoomId };

    const result = await sanityClient.fetch(query, params);
    return result ? result : null;
}

export async function updateReview({ reviewId, reviewText, userRating }: UpdateReviewDto) {
    const mutation = {
        mutations: [
            {
                patch: {
                    id: reviewId,
                    set: {
                        text: reviewText,
                        userRating,
                    }
                }
            }
        ]
    };

    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        { 
            headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` }
        }
    );

    return data;
}

export async function CreateReview({
    hotelRoomId,
    reviewText,
    userId,
    userRating
} : CreateReviewDto) {

    const mutation = {
        mutations: [
            {
                create: {
                    _type: 'review',
                    user: {
                        _type: 'reference',
                        _ref: userId
                    },
                    hotelRoom: {
                        _type: "reference",
                        _ref: hotelRoomId
                    },
                    userRating,
                    text: reviewText,
                }
            }
        ]
    };

    const { data } = await axios.post(
        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/mutate/${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
        mutation,
        { 
            headers: { Authorization: `Bearer ${process.env.SANITY_STUDIO_TOKEN}` }
        }
    );

    return data;
}

export async function getRoomReviews(roomId: string) {
    return await sanityClient.fetch<Review[]>(
        queries.getRoomReviewsQuery,
        { roomId },
        { cache: 'no-cache' });
}