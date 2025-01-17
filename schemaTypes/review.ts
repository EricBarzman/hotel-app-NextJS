import { defineField } from "sanity";

const review = {
    name: 'review',
    title: 'Review',
    type: 'document',
    fields: [
        defineField({
            name: 'user',
            title: 'User',
            type: 'reference',
            to: [{ type: 'user' }],
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'hotelRoom',
            title: 'Hotel room',
            type: 'reference',
            to: [{ type: 'hotelRoom' }],
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'text',
            title: 'Review text',
            type: 'text',
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'userRating',
            title: 'User rating',
            type: 'number',
            validation: Rule => Rule.required().min(1).max(5).error("Rating must be between 1 and 5"),
        }),
    ]
};

export default review;