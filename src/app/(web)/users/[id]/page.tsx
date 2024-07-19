"use client";

import { getUserBookings } from "@/libs/apis";
import { User } from "@/models/user";
import axios from "axios";
import useSWR from "swr";

import LoadingSpinner from "../../loading";

import { signOut } from "next-auth/react";
import { useState } from "react";

import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";
import { BsJournalBookmarkFill } from "react-icons/bs";
import { GiMoneyStack } from "react-icons/gi";
import toast from "react-hot-toast";

import Table from "@/components/Table/Table";
import Chart from "@/components/Chart/Chart";
import RatingModal from "@/components/RatingModal/RatingModal";
import BackDrop from "@/components/BackDrop/BackDrop";


function UserDetails(props: { params : { id: string } }) {

  // Recover user ID
  const { params : { id: userId }} = props;

  // States
  const [currentNav, setCurrentNav] = useState<"bookings" | "amount" | "ratings">('bookings');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);


  // Functions
  const toggleRatingModal = () => {
    setIsRatingModalVisible(!isRatingModalVisible);
    setRatingValue(0);
    setRatingComment('');
  };

  const reviewSubmitHandler = async () => {
    if (!ratingComment.trim().length || !ratingValue)
      return toast.error('Please provide a review and a rating')

    if (!roomId) 
      return toast.error('Room ID not provided');

    setIsSubmittingReview(true);

    try {
      const { data } = await axios.post('/api/users', {
        roomId,
        reviewText: ratingComment,
        userRating: ratingValue,
      });

      toast.success("Review successfully submitted!")

    } catch(error) {
      console.log(error);
      toast.error('Could not submit review');

    } finally {
      setRatingComment('');
      setRatingValue(0);
      setRoomId(null);
      setIsSubmittingReview(false);
      setIsRatingModalVisible(false);
    }
  }
    
  const fetchUserBookings = async () => getUserBookings(userId);

  const fetchUserData = async () => {
    const { data } = await axios.get<User>('/api/users');
    return data;
  }
  const {
    data: userBookings,
    error,
    isLoading
  } = useSWR("/api/userbooking", fetchUserBookings);

  const {
    data: userData,
    isLoading: loadingUserData,
    error: errorGettingUserData
  } = useSWR("/api/users", fetchUserData)
  
  // Checks
  if (error || errorGettingUserData)
    throw new Error("Cannot fetch data");
  if (typeof userBookings === "undefined" && !isLoading)
    throw new Error("Cannot fetch data");
  if (typeof userData === "undefined" && !loadingUserData)
    throw new Error("Cannot fetch data");
  
  if (loadingUserData) return <LoadingSpinner/>;
  if (!userData)
    throw new Error("Cannot fetch data");
  

  return (
    <div className="container mx-auto px-2 md:px-4 py-10">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="hidden md:block md:col-span-4 lg:col-span-3 shadow-lg h-fit sticky top-10 bg-[#eff0f2] text-black rounded-lg px-6 py-4">
          
          <div className="md:w-[143px] w-28 h-28 md:h-[143px] mx-auto mb-5 rounded-full overflow-hidden">
            <Image
              src={userData.image}
              alt={userData.name}
              width={143}
              height={143}
              className="img scale-animation rounded-full"
            />
          </div>

          <div className="font-normal py-4 text-left">
            <h6 className="text-xl font-bold pb-3">About</h6>
            <p className="text-sm">{userData.about ?? ''}</p>
          </div>

          <div className="font-normal text-left">
            <h6 className="text-xl font-bold pb-3">{userData.name}</h6>
          </div>

          <div className="flex items-center">
            <p className="mr-2">Sign out</p>
            <FaSignOutAlt
              className="text-3xl cursor-pointer"
              onClick={() => signOut({ callbackUrl: '/' })}
            />
          </div>

        </div>

        <div className="md:col-span-8 lg:col-span-9">

          {/* Hello user */}
          <div className="flex items-center">
            <h5 className="text-2xl font-bold mr-3">Hello, {userData.name}</h5>
          </div>

          {/* Avatar */}
          <div className="md:hidden w-14 h-14 rounded-l-full overflow-hidden">
            <Image
              className="img scale-animation rounded-full"
              width={56}
              height={56}
              src={userData.image}
              alt="user name"
            />
          </div>

          {/* About, on mobile */}
          <p className="block w-fit md:hidden text-sm py-2">{userData.about ?? ''}</p>

          {/* Member since */}
          <p className="text-xs py-2 font-medium">Member since {userData._createdAt.split('T')[0]}</p>

          {/* Sign out, on mobile */}
          <div className="md:hidden flex items-center my-2">
            <p className="mr-2">Sign out</p>
            <FaSignOutAlt
              className="text-xl cursor-pointer"
              onClick={() => signOut({ callbackUrl: '/' })}
            />
          </div>

          {/* BOOKINGS */}
          <nav className="sticky top-0 px-2 w-fit mx-auto md:w-full md:px-5 py-3 mb-8 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 mt-7">
            
            <ol className={`${currentNav === "bookings" ? "text-blue-600" : "text-gray-700"} inline-flex mr-1 md:mr-5 items-center space-x-1 md:space-x-3`}>
              <li
                className="inline-flex items-center cursor-pointer"
                onClick={() => setCurrentNav("bookings")}
              >
                <BsJournalBookmarkFill />
                <p className="inline-flex items-center mx-1 md:mx-3 text-xs md:text-sm font-medium">Current Bookings</p>
              </li>
            </ol>

            <ol className={`${currentNav === "amount" ? "text-blue-600" : "text-gray-700"} inline-flex mr-1 md:mr-5 items-center space-x-1 md:space-x-3`}>
              <li
                className="inline-flex items-center cursor-pointer"
                onClick={() => setCurrentNav("amount")}
              >
                <GiMoneyStack />
                <p className="inline-flex items-center mx-1 md:mx-3 text-xs md:text-sm font-medium">Amount spent</p>
              </li>
            </ol> 

          </nav>
          
          {currentNav === "bookings" ? userBookings && (
            <Table bookingDetails={userBookings} setRoomId={setRoomId} toggleRatingModal={toggleRatingModal}/>
            ) : <></>}

          {currentNav === "amount" ? userBookings &&
          <Chart userBookings={userBookings} />
          : (<></>)}

        </div>
      </div>

      <RatingModal
        isOpen={isRatingModalVisible}
        ratingValue={ratingValue}
        setRatingValue={setRatingValue}
        setRatingComment={setRatingComment}
        ratingComment={ratingComment}
        reviewSubmitHandler={reviewSubmitHandler}
        isSubmittingReview={isSubmittingReview}
        toggleRatingModal={toggleRatingModal}
      />
      <BackDrop isOpen={isRatingModalVisible} />
    </div>
  );
}

export default UserDetails