import React from "react";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Bookcard from "../../Components/BookCard/Bookcard";

const Books = () => {
  const [axiosSecure] = UseAxiosSecure();
  // get orders
  const { data: books = [], refetch: booksRefetch } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/books`);
      return res.data;
    },
  });

  console.log(books)
  return <div>
<div className="grid grid-cols-5 gap-4">

    {
        books.map(b=> <Bookcard key={b?._id} book={b} />)
    }
</div>
  </div>;
};

export default Books;
