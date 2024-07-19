import { defineField } from "sanity";

const roomTypes = [
    { title: "Basic", value: "basic" },
    { title: "Luxury", value: "luxury" },
    { title: "Suite", value: "suite" },
]

const hotelRoom = {
    name: 'hotelRoom',
    title: 'Hotel Room',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: Rule => Rule.required().max(50).error("Maximum 50 characters"),
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: {
                source: 'name',
            },
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            validation: Rule => Rule.required().min(100).error("Minimum 100 characters"),
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'discount',
            title: 'Discount',
            type: 'number',
            initialValue: 0,
            validation: Rule => Rule.required().min(0),
        }),
        defineField({
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'url', type: 'url', title: 'URL' },
                    { name: 'file', type: 'file', title: 'File' },
                ]
            }],
            validation: Rule => Rule.required().min(3).error("Minimum 3 images required"),
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'object',
            fields: [
                { name: 'url', type: 'url', title: 'URL' },
                { name: 'file', type: 'file', title: 'File' },
            ],
            validation: Rule => Rule.required().error("A cover image is required"),
        }),
        defineField({
            name: 'type',
            title: 'Room type',
            type: 'string',
            options: {
                list: roomTypes,
            },
            initialValue: 'basic',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'specialNote',
            title: 'Special note',
            type: 'text',
            initialValue: 'Check-in time is 15:00 PM, checkout time is 11:59 AM. If you leave behind any items, please contact the reception',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'dimension',
            title: 'Dimension',
            type: 'string',
        }),
        defineField({
            name: 'numberOfBeds',
            title: 'Number of beds',
            type: 'number',
            initialValue: 1,
            validation: Rule => Rule.required().min(1),
        }),
        defineField({
            name: 'offeredAmenities',
            title: 'Offered amenities',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'icon', title: "Icon", type: 'string' },
                    { name: 'amenity', title: "Amenity", type: 'string' },
                ],
            }],
        }),
        defineField({
            name: 'isBooked',
            title: 'Is room booked',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'isFeatured',
            title: 'Is room featured',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'reviews',
            title: 'Reviews',
            type: 'array',
            of: [{ type: 'review' }],
        }),
    ],
}

export default hotelRoom;