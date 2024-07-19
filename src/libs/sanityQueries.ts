import { groq } from "next-sanity";

export const getFeaturedRoomQuery = groq`*[_type == "hotelRoom" && isFeatured == true][0] {
    _id,
    description,
    discount,
    coverImage,
    images,
    isFeatured,
    name,
    price,
    slug
}`

export const getRoomsQuery = groq`*[_type == "hotelRoom"] {
    _id,
    name,
    price,
    slug,
    type,
    coverImage,
    description,
    dimension,
    isBooked,
    isFeatured
}`

export const getRoomQuery = groq`*[_type == "hotelRoom" && slug.current == $slug][0] {
    _id,    
    name,
    numberOfBeds,
    offeredAmenities,
    price,
    slug,
    specialNote,
    type,
    coverImage,
    description,
    discount,
    images,
    dimension,
    isBooked,
    isFeatured
}`

export const getUserBookingsQuery = groq`*[_type == 'booking' && user._ref == $userId] {
    _id,
    hotelRoom -> {
        _id,
        name,
        slug,
        price
    },
    checkinDate,
    checkoutDate,
    numberOfDays,
    adults,
    children,
    totalPrice,
    discount
}`

export const getUserDataQuery = groq`*[_type == 'user' && _id == $userId][0] {
    _id,
    name,
    email,
    isAdmin,
    about,
    _createdAt,
    image,
}`

export const getRoomReviewsQuery = groq`*[_type == 'review' && hotelRoom._ref == $roomId] {
    _id,
    _createdAt,
    text,
    user -> {
        name
    },
    userRating
}`