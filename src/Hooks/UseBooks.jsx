import { useEffect, useState } from "react";
import UseAxiosSecure from "./UseAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const UseBooks = (page) => {
    console.log(page);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState([]);
    const [axiosSecure] = UseAxiosSecure();

    // Get books
    const { data: objects = {}, refetch: booksRefetch, isError } = useQuery({
        queryKey: ["books", page],
        queryFn: async () => {
            const res = await axiosSecure.get(`/books?page=${page}`);
            return res.data;
        },
        onError: () => {
            setLoading(false);
        },
    });

    console.log(books);

    useEffect(() => {
        if (objects && objects.totalPages !== undefined && objects.books !== undefined) {
            setTotalPages(objects.totalPages);
            setBooks(objects.books);
        } else {
            setTotalPages(1);
            setBooks([]);
        }
        setLoading(false);
    }, [objects]);

    useEffect(() => {
        setLoading(true);
        booksRefetch();
    }, [page]);

    return { books, totalPages, loading, isError };
};

export default UseBooks;
