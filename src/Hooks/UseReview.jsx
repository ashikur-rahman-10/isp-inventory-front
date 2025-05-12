import React from 'react';
import UseAxiosSecure from './UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const UseReview = (_id) => {
    const [axiosSecure] = UseAxiosSecure();
    // get review
    const { data: reviews = [], refetch: reviewsRefetch } = useQuery({
        queryKey: ["reviews"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/reviews/books/${_id}`);
            return res.data;
        },
    });

    console.log(reviews);

    return { reviews, reviewsRefetch }
};

export default UseReview;