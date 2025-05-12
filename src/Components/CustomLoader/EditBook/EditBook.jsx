import React, { useEffect, useState } from "react";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const EditBook = ({ id, booksRefetch, setShowModal }) => {
    // console.log(id);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdown1, setShowDropdown1] = useState(false);
    const [book, setBook] = useState([]);
    const [axiosSecure] = UseAxiosSecure();

    useEffect(() => {
        fetch(`https://bornomala-boighor-server.vercel.app/books/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setBook(data); // Update the state with the fetched data
            });
    }, [id]);

    // get catagories
    const { data: cats = [], refetch: catagoriesRefetch } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/categories`);
            setLoading(false);
            return res.data;
        },
    });

    // get publications
    const { data: publications = [], refetch: publicationsRefetch } = useQuery({
        queryKey: ["publications"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/publications`);
            setLoading(false);
            return res.data;
        },
    });
    // get writers
    const { data: writers = [], refetch: writersRefetch } = useQuery({
        queryKey: ["writers"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/writers`);
            setLoading(false);
            return res.data;
        },
    });

    // Handle Writer Search
    const handleWriterSearch = (event) => {
        const query = event.target.value
            ? event.target.value.toLowerCase()
            : "";
        const filteredWriter = writers.filter(
            (writer) =>
                writer &&
                writer.writerName &&
                writer.writerName.toLowerCase().includes(query)
        );
        setSearchResults(filteredWriter);
        setShowDropdown1(true);
    };

    // Handle publication search
    const handlePublicationSearch = (event) => {
        const query = event.target.value
            ? event.target.value.toLowerCase()
            : "";
        const filteredPublications = publications.filter(
            (pub) => pub && pub.pub && pub.pub.toLowerCase().includes(query)
        );
        setSearchResults(filteredPublications);
        setShowDropdown(true);
    };

    const handleDropdownItemClick = (publication) => {
        setValue("publications", publication, { shouldValidate: true });

        setShowDropdown(false);
    };

    // Set Writer Value
    const handleWriterDropdown = (writer) => {
        setValue("writerName", writer, { shouldValidate: true });

        setShowDropdown1(false);
    };

    // Handle Form input
    const {
        register,
        reset,
        handleSubmit,
        setValue,
        formState: { errors },

    } = useForm({
        defaultValues: {
            bookName: book?.bookName || "",
            price: book?.price || "",
            quantity: book?.quantity || "",
            discounts: book?.discounts || "",
            category: book?.category || "",
            writerName: book?.writerName || "",
            publications: book?.publications || "",
            descriptions: book?.descriptions || "",
            bookName_en: book?.bookName_en || "",
            keywords: book?.keywords || "",
            buyingPrice: book?.buyingPrice || "",
        }
    });


    useEffect(() => {
        if (book) {
            reset({
                bookName: book?.bookName || "",
                price: book?.price || "",
                quantity: book?.quantity || "",
                discounts: book?.discounts || "",
                category: book?.category || "",
                writerName: book?.writerName || "",
                publications: book?.publications || "",
                descriptions: book?.descriptions || "",
                bookName_en: book?.bookName_en || "",
                keywords: book?.keywords || "",
                buyingPrice: book?.buyingPrice || "",
            });
        }
    }, [book, reset]);


    const onSubmit = (data, event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const {
            bookName,
            category,
            writerName,
            publications,
            price,
            discounts,
            quantity,
            descriptions,
            bookName_en,
            keywords,
            buyingPrice
        } = data;

        const editedBook = {
            bookName,
            price: parseInt(price),
            quantity: parseInt(quantity),
            discounts,
            category,
            writerName,
            publications,
            descriptions,
            bookName_en,
            keywords,
            buyingPrice
        };

        // Update form data with the latest values from the input fields
        Object.keys(data).forEach((key) => {
            setValue(key, data[key]);
        });


        axiosSecure.patch(`/books/${id}`, data).then((response) => {
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

    // Scroll to top
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
    });

    return (
        <div className="">
            <h1 className="text-center pt-4 md:pt-8 text-2xl">{book?.bookName} </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-fit mx-auto rounded-lg md:p-10 flex flex-col justify-center items-center p- mb-8 text-xs"
            >
                <div className="flex  md:gap-4 flex-col md:flex-row">
                    <div className="form-control">
                        <label className="label">
                            <span className="text-xs text-[#757575dc] font-medium">
                                Book name
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder="book name"
                            //  defaultValue={book?.bookName}
                            {...register("bookName", { required: true })}
                            className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-80"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="text-xs text-[#757575dc] font-medium">
                                Book name EN
                            </span>
                        </label>
                        <input
                            type="text"
                            placeholder="book name english"
                            //  defaultValue={book?.bookName_en}
                            {...register("bookName_en", { required: true })}
                            className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-80"
                        />
                    </div>


                </div>

                <div className="flex  md:gap-4 flex-col md:flex-row">
                    <div className="form-control">
                        <label className="label">
                            <span className="text-xs text-[#757575dc] font-medium">
                                Category
                            </span>
                        </label>
                        {loading ? (
                            <p>Loading categories...</p>
                        ) : (
                            <div className="relative">
                                <select
                                    {...register("category", {
                                        required: true,
                                    })}
                                    //  defaultValue={book?.category}
                                    className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-80"
                                >
                                    <option>Select a category</option>
                                    {cats.map((c) => (
                                        <option key={c._id} value={c.cat}>
                                            {c.cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {errors.c && <span className="text-red-500"></span>}
                    </div>
                    <div className="form-control ">
                        <label className="label">
                            <span className="text-xs text-[#757575] font-medium ">
                                Writer Name
                            </span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search Writer name"
                                //  defaultValue={book?.writerName}
                                {...register("writerName", {
                                    required: true,
                                })}
                                className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-80"
                                onChange={handleWriterSearch}
                            />
                        </div>

                        {showDropdown1 && (
                            <span>
                                {searchResults.length > 0 && (
                                    <div className="absolute z-10  lg:w-[350px] w-80 bg-white border border-gray-200 rounded-sm shadow-md">
                                        {searchResults.map((result) => (
                                            <div
                                                key={result._id}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() =>
                                                    handleWriterDropdown(
                                                        result.writerName
                                                    )
                                                }
                                            >
                                                {result.writerName}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </span>
                        )}
                    </div>


                </div>

                <div className="flex  md:gap-4 flex-col md:flex-row">
                    <div className="form-control ">
                        <label className="label">
                            <span className="text-xs text-[#757575] font-medium ">
                                Publications Name
                            </span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search publication name"
                                //  defaultValue={book?.publications}
                                {...register("publications", {
                                    required: true,
                                })}
                                className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-80"
                                onChange={handlePublicationSearch}
                            />
                        </div>

                        {showDropdown && (
                            <span>
                                {searchResults.length > 0 && (
                                    <div className="absolute z-10  lg:w-[350px] w-80 bg-white border border-gray-200 rounded-sm shadow-md">
                                        {searchResults.map((result) => (
                                            <div
                                                key={result._id}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() =>
                                                    handleDropdownItemClick(
                                                        result.pub
                                                    )
                                                }
                                            >
                                                {result.pub}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </span>
                        )}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="text-xs text-[#757575] font-medium ">
                                Price
                            </span>
                        </label>
                        <input
                            type="number"
                            placeholder="price"
                            //  defaultValue={book?.price}
                            {...register("price", {
                                required: true,
                            })}
                            className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-80"
                        />
                    </div>

                </div>
                <div className="flex  md:gap-4 flex-col md:flex-row">
                    <div className="form-control">
                        <label className="label">
                            <span className="text-xs text-[#757575] font-medium ">
                                Discounts
                            </span>
                        </label>
                        <input
                            type="number"
                            placeholder="discounts"
                            //  defaultValue={book?.discounts}
                            {...register("discounts", {
                                required: true,
                            })}
                            className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-80"
                        />
                    </div>

                    {/* Buying price */}

                    <div className="form-control">
                        <label className="label">
                            <span className="text-xs text-[#757575] font-medium ">Buying Price</span>
                        </label>
                        <input
                            type="number"
                            placeholder="buying price"
                            {...register("buyingPrice")}
                            className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-80"
                        />
                    </div>

                </div>

                <div className="flex  md:gap-4 flex-col md:flex-row">
                    <div className="form-control">
                        <label className="label">
                            <span className="text-xs text-[#757575] font-medium ">
                                Descriptions
                            </span>
                        </label>
                        <textarea
                            type="text"
                            placeholder="descriptions"
                            //  defaultValue={book?.descriptions}
                            {...register("descriptions", {
                                required: true,
                            })}
                            className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-80"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="text-xs text-[#757575] font-medium ">
                                Keywords
                            </span>
                        </label>
                        <textarea
                            type="text"
                            placeholder="keywords"
                            //  defaultValue={book?.keywords}
                            {...register("keywords", {
                                required: true,
                            })}
                            className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-80"
                        />
                    </div>
                </div>


                <input
                    // onClick={handleSubmit(onSubmit)}
                    type="submit"
                    value={"Save"}
                    className="border border-success py-1 px-3 mt-4 rounded-xl cursor-pointer hover:scale-110 duration-300 hover:bg-success hover:text-white hover:border-warning"
                />
            </form>
        </div>
    );
};

export default EditBook;
