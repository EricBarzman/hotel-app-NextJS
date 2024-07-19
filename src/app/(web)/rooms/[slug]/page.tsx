'use client';

import { useState } from "react";

import { MdOutlineCleaningServices } from "react-icons/md";
import { LiaFireExtinguisherSolid } from "react-icons/lia"
import { AiOutlineMedicineBox } from "react-icons/ai";
import { GiSmokeBomb } from "react-icons/gi";

import { getRoom } from "@/libs/apis";
import useSWR from "swr";
import LoadingSpinner from "../../loading";

import HotelPhotoGallery from "@/components/HotelPhotoGallery/HotelPhotoGallery";
import BookRoomCTA from "@/components/BookRoomCTA/BookRoomCTA";
import toast from "react-hot-toast";
import axios from "axios";
import { getStripe } from "@/libs/stripe";
import RoomReview from "@/components/RoomReview/RoomReview";

export default function RoomDetails(
    props: {
        params: { slug: string }
    }
) {

    const { params : { slug } } = props;
    
    const [checkinDate, setCheckinDate] = useState<Date | null>(null);
    const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);

    const [adults, setAdults] = useState(1);
    const [numOfChildren, setChildren] = useState(0);

    // Get room info

    async function fetchRoom() {
        return getRoom(slug);
    }
    const { data: room, error, isLoading } = useSWR("/api/room", fetchRoom);
    if (error)
        throw new Error("Cannot fetch data");
    if (typeof room === "undefined" && !isLoading)
        throw new Error("Cannot fetch data"); null

    if (!room)
        return <LoadingSpinner />


    function calcMinCheckoutDate() {
        if (!checkinDate)
            return null
        
        const nextDay = new Date(checkinDate);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay;
    }


    function calcNumberOfDays() {
        if (!checkinDate || !checkoutDate)
            return 0;

        const timeDiffInMillisec = checkoutDate.getTime() - checkinDate.getTime();
        const numOfDays = Math.ceil(timeDiffInMillisec / (24 * 60 * 60 * 1000));
        return numOfDays;
    }


    // Pay and book

    async function handleBookNowClick() {
        
        if (!checkinDate || !checkoutDate)
            return toast.error("Please provide check-in/check-out dates");
        
        if (checkinDate > checkoutDate)
            return toast.error("Check-in date cannot be after check-out")

        const numberOfDays = calcNumberOfDays()
        const hotelRoomSlug = room!.slug.current;

        const stripe = await getStripe();

        // Stripe
        try {
            const { data: stripeSession } = await axios.post('/api/stripe', {
                checkinDate,
                checkoutDate,
                adults,
                children: numOfChildren,
                numberOfDays,
                hotelRoomSlug
            })

            if (stripe) {
                const result = await stripe.redirectToCheckout({
                    sessionId: stripeSession.id,
                });

                if (result.error) {
                    toast.error('Payment failed');
                }
            }
            
        } catch(error) {
            console.log("Error: ", error);
            toast.error("An error has occurred.");
        }
        
    }


    return (
        <div>
            <HotelPhotoGallery photos={room.images} />

            <div className="container mx-auto mt-20">
                <div className="md:grid md:grid-cols-12 gap-10 px-3">

                    <div className="md:col-span-8 md:w-full">

                        {/* Room name */}
                        <h2 className="font-bold text-left text-lg md:text-2xl">
                            {room.name} <span className="font-normal capitalize">({room.dimension})</span>
                        </h2>

                        {/* Amenities icons */}
                        <div className="flex my-11">
                            {room.offeredAmenities.map(amenity => (
                                <div 
                                    key={amenity._key}
                                    className="md:w-44 w-fit text-center px-2 md:px-0 h-20 md:h-40 mr-3 bg-[#eff0f2] dark:bg-gray-800 rounded-lg grid place-content-center"
                                >
                                    <i className={`fa-solid ${amenity.icon} md:text-2xl`}></i>
                                    <p className="text-xs md:text-base pt-3">{amenity.amenity}</p>
                                </div>
                            ))}
                        </div>
                        
                        {/* Description */}
                        <div className="mb-11">
                            <h2 className="font-bold text-3xl mb-3">
                                Description
                            </h2>
                            <p>{room.description}</p>
                        </div>

                        {/* Amenities summary (again) */}
                        <div className="mb-11">
                            <h2 className="font-bold text-3xl mb-3">Offered Amenities</h2>
                            <div className="grid grid-cols-2">
                                {room.offeredAmenities.map(amenity => (
                                    <div key={amenity._key} className="flex items-center md:my-2 my-1">
                                        <i className={`fa-solid ${amenity.icon}`}></i>
                                        <p className="text-xs md:text-base ml-2">{amenity.amenity}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Safety & cleaning */}
                        <div className="mb-11">

                            <h2 className="font-bold text-3xl mb-3">
                                Safety and cleaning
                            </h2>

                            <div className="grid grid-cols-2">
                                <div className="flex items-center my-1 md:my-0">
                                    <MdOutlineCleaningServices />
                                    <p className="text-xs md:text-base ml-2">
                                        Daily cleaning
                                    </p>
                                </div>

                                <div className="flex items-center my-1 md:my-0">
                                    <LiaFireExtinguisherSolid />
                                    <p className="text-xs md:text-base ml-2">
                                        Fire extinguisher
                                    </p>
                                </div>

                                <div className="flex items-center my-1 md:my-0">
                                    <GiSmokeBomb />
                                    <p className="text-xs md:text-base ml-2">
                                        Smoke detectors
                                    </p>
                                </div>

                                <div className="flex items-center my-1 md:my-0">
                                    <AiOutlineMedicineBox />
                                    <p className="text-xs md:text-base ml-2">
                                        First aid kit
                                    </p>
                                </div> 
                            </div>

                        </div>

                        {/* Reviews */}
                        <div className="shadow dark:shadow-white rounded-lg p-6">
                            <div className="items-center mb-4">
                                <h3 className="md:text-lg font-semibold">
                                    Customer reviews
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <RoomReview roomId={room._id} />
                            </div>
                        </div>

                    </div>

                    <div className="md:col-span-4 rounded-xl shadow-lg dark:shadow dark:shadow-white sticky top-10 h-fit overflow-auto">
                        <BookRoomCTA
                            discount={room.discount}
                            price={room.price}
                            specialNote={room.specialNote}
                            checkinDate={checkinDate}
                            setCheckinDate={setCheckinDate}
                            checkoutDate={checkoutDate}
                            setCheckoutDate={setCheckoutDate}
                            calcMinCheckoutDate={calcMinCheckoutDate}
                            calcNumberOfDays={calcNumberOfDays}
                            adults={adults}
                            numOfChildren={numOfChildren}
                            setAdults={setAdults}
                            setChildren={setChildren}
                            isBooked={room.isBooked}
                            handleBookNowClick={handleBookNowClick}
                        />
                    </div>

                </div>
            </div>

        </div>
    )
}