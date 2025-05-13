import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";

const EditBook = ({ id, booksRefetch, setShowModal }) => {
    console.log(id)
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown1, setShowDropdown1] = useState(false);
    const [book, setBook] = useState(null); // initialized as null
    const [axiosSecure] = UseAxiosSecure();

    // Fetch specific book
    useEffect(() => {
        fetch(`http://localhost:5000/books/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setBook(data);
            });
    }, [id]);

    // Get writers
    const { data: writers = [] } = useQuery({
        queryKey: ["writers"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/writers`);
            return res.data;
        },
    });

    // React Hook Form
    const {
        register,
        reset,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // When book data is loaded, reset form values
    useEffect(() => {
        if (book) {
            reset({
                bookName: book?.bookName || "",
                price: book?.price || "",
                quantity: book?.quantity || "",
                writerName: book?.writerName || "",
                keywords: book?.keywords || "",
                buyingPrice: book?.buyingPrice || "",
            });
        }
    }, [book, reset]);

    // Writer search
    const handleWriterSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filtered = writers.filter((writer) =>
            writer.writerName.toLowerCase().includes(query)
        );
        setSearchResults(filtered);
        setShowDropdown1(true);
    };

    // Dropdown selection
    const handleWriterDropdown = (writer) => {
        setValue("writerName", writer, { shouldValidate: true });
        setShowDropdown1(false);
    };

    // Handle submit
    const onSubmit = (data, event) => {
        event.preventDefault();

        const editedBook = {
            ...book,
            ...data,
            price: parseInt(data.price),
            quantity: parseInt(data.quantity),
            buyingPrice: parseInt(data.buyingPrice),
        };

        axiosSecure.patch(`/books/${id}`, editedBook).then((response) => {
            if (response.data.acknowledged) {
                booksRefetch();
                setShowModal(false);
                Swal.fire({
                    icon: "success",
                    title: "Book Edited Successfully",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        });
    };

    if (!book) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="px-4">
            <h1 className="text-center pt-4 md:pt-8 text-2xl font-semibold">
                Edit Book: {book?.bookName}
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-fit mx-auto rounded-lg md:p-10 flex flex-col justify-center items-center mb-8 text-xs bg-black"
            >
                <div className="space-y-3">
                    {/* Book Name */}
                    <div>
                        <label className="label text-xs font-medium text-gray-600">
                            Book Name
                        </label>
                        <input
                            type="text"
                            placeholder="Book Name"
                            {...register("bookName", { required: true })}
                            className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-80"
                        />
                        {errors.bookName && (
                            <p className="text-red-500 text-xs">Book name is required</p>
                        )}
                    </div>

                    {/* Writer Name */}
                    <div className="relative">
                        <label className="label text-xs font-medium text-gray-600">
                            Writer Name
                        </label>
                        <input
                            type="text"
                            placeholder="Search Writer"
                            {...register("writerName", { required: true })}
                            className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-80"
                            onChange={handleWriterSearch}
                        />
                        {showDropdown1 && searchResults.length > 0 && (
                            <div className="absolute z-10 bg-white border border-gray-200 rounded-sm shadow-md lg:w-[350px] w-80 max-h-48 overflow-auto">
                                {searchResults.map((writer) => (
                                    <div
                                        key={writer._id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            handleWriterDropdown(writer.writerName)
                                        }
                                    >
                                        {writer.writerName}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="label text-xs font-medium text-gray-600">
                            Price
                        </label>
                        <input
                            type="number"
                            placeholder="Price"
                            {...register("price", { required: true })}
                            className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-80"
                        />
                        {errors.price && (
                            <p className="text-red-500 text-xs">Price is required</p>
                        )}
                    </div>

                    {/* Buying Price */}
                    <div>
                        <label className="label text-xs font-medium text-gray-600">
                            Buying Price
                        </label>
                        <input
                            type="number"
                            placeholder="Buying Price"
                            {...register("buyingPrice")}
                            className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-80"
                        />
                    </div>

                    {/* Keywords */}
                    <div>
                        <label className="label text-xs font-medium text-gray-600">
                            Keywords
                        </label>
                        <textarea
                            placeholder="Keywords"
                            {...register("keywords", { required: true })}
                            className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-80"
                        />
                        {errors.keywords && (
                            <p className="text-red-500 text-xs">Keywords are required</p>
                        )}
                    </div>

                    {/* Submit */}
                    <input
                        type="submit"
                        value="Save"
                        className="border border-success py-1 px-4 mt-4 rounded-xl cursor-pointer hover:scale-110 duration-300 hover:bg-success hover:text-white"
                    />
                </div>
            </form>
        </div>
    );
};

export default EditBook;
