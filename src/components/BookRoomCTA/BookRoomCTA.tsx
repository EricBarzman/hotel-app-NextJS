'use client';

import { Dispatch, FC, SetStateAction } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

type Props = {
    isBooked: boolean;
    price: number;
    discount: number;
    specialNote: string;
    checkinDate: Date | null;
    setCheckinDate: Dispatch<SetStateAction<Date | null>>;
    checkoutDate: Date | null;
    setCheckoutDate: Dispatch<SetStateAction<Date | null>>;
    calcMinCheckoutDate: () => Date | null;
    calcNumberOfDays: () => number;
    adults: number;
    numOfChildren: number;
    setAdults: Dispatch<SetStateAction<number>>;
    setChildren: Dispatch<SetStateAction<number>>;
    handleBookNowClick: () => void;
}

const BookRoomCTA: FC<Props> = (props) => {
    
    const {
        isBooked,
        price,
        discount,
        specialNote,
        checkinDate,
        setCheckinDate,
        checkoutDate,
        setCheckoutDate,
        calcMinCheckoutDate,
        calcNumberOfDays,
        adults,
        numOfChildren,
        setAdults,
        setChildren,
        handleBookNowClick,
    } = props;

    const discountPrice = price - ((price / 100) * discount);

    return (
        <div className="px-7 py-6">
            <h3>
                <span className={`${discount ? "text-gray-400 line-through" : ""} font-bold text-xl`}>
                    ${price}
                </span>
                {discount ? (
                    <span className="font-bold text-xl">
                        {' '}${discountPrice} <span className="text-base font-medium">({discount}% discount)</span> 
                    </span>
                ) : ('')}
            </h3>

            {/* Little line :) */}
            <div className="w-full border-b-2 border-b-secondary my-2" />

            {/* Special note */}
            <h4 className="my-8">{specialNote}</h4>

            {/* Date picker */}
            <div className="flex">
                
                <div className="w-1/2 pr-2">
                    <label
                        htmlFor="check-in-date"
                        className="block font-medium text-sm text-gray-900 dark:text-gray-400"
                    >
                        Check-in date
                    </label>
                    <DatePicker
                        selected={checkinDate}
                        onChange={date => setCheckinDate(date)}
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        id="check-in-date"
                        className="w-full border text-black border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary"
                    />

                </div>

                <div className="w-1/2 pl-2">
                    <label
                        htmlFor="check-out-date"
                        className="block font-medium text-sm text-gray-900 dark:text-gray-400"
                    >
                        Check-out date
                    </label>
                    <DatePicker
                        selected={checkoutDate}
                        onChange={date => setCheckoutDate(date)}
                        dateFormat="dd/MM/yyyy"
                        disabled={!checkinDate}
                        minDate={calcMinCheckoutDate()!}
                        id="check-out-date"
                        className="w-full border text-black border-gray-300 rounded-lg p-2.5 focus:ring-primary focus:border-primary"
                    />

                </div>
            </div>

            {/* Number of adults, children */}
            <div className="flex mt-4">
                <div className="w-1/2 pr-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-400" htmlFor="adults">
                        Adults
                    </label>
                    <input
                        type="number"
                        value={adults}
                        id="adults"
                        onChange={(e) => setAdults(+e.target.value)}
                        min={1}
                        max={5}
                        className="w-full border border-gray-300 rounded-lg p-2.5"
                    />
                </div>

                <div className="w-1/2 pl-2">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-400" htmlFor="children">
                        Children
                    </label>
                    <input
                        type="number"
                        value={numOfChildren}
                        id="children"
                        onChange={(e) => setChildren(+e.target.value)}
                        min={0}
                        max={5}
                        className="w-full border border-gray-300 rounded-lg p-2.5"
                    />
                </div>
            </div>

            {/* Total price */}
            {calcNumberOfDays() > 0 ? (
                <p className="mt-5">
                    Total Price: ${calcNumberOfDays() * discountPrice}
                </p>
            ) : <></>}

            <button
                disabled={isBooked}
                onClick={handleBookNowClick}
                className="btn-primary w-full mt-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {isBooked ? "Already booked" : "Book now"}
            </button>

        </div>
  )
}

export default BookRoomCTA