import React from 'react';
import UseAxiosSecure from './UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const UseAllBooks = () => {
    const [axiosSecure] = UseAxiosSecure();
    // get books
    const { data: books = [], refetch: booksRefetch } = useQuery({
        queryKey: ["books"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/all-books`);
            return res.data;
        },
    });
    return { books, booksRefetch }
};

export default UseAllBooks;