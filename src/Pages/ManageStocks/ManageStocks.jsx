import React, { useEffect, useState } from 'react';
import UseAllBooks from '../../../../Hooks/UseAllBooks';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../../../Hooks/UseAxiosSecure';

const ManageStocks = () => {
    const [axiosSecure] = UseAxiosSecure();
    const [stockOutBooks, setStockOutBooks] = useState([]);
    const { books, booksRefetch } = UseAllBooks();


    useEffect(() => {
        const stockOutBooks = books.filter(b => b.quantity <= 5);
        setStockOutBooks(stockOutBooks);
    }, [books]);

    const handleRestock = (bookId) => {
        Swal.fire({
            title: "Submit Quantity You Want To ADD",
            input: "number",
            inputAttributes: {
                autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Restock",
            showLoaderOnConfirm: true,
            preConfirm: async (quantity) => {
                const data = { quantity }

                axiosSecure.patch(`/books/restock/${bookId}`, data).then((response) => {
                    if (response.data.acknowledged) {
                        booksRefetch();
                        Swal.fire({
                            icon: "success",
                            title: "Book Edited Successfully",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    }
                });
            },
            allowOutsideClick: () => !Swal.isLoading()
        });
    };

    return (
        <div className='p-4'>
            <div>
                <div className="overflow-x-auto py-8">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name <br /> Category</th>
                                <th>Writer <br /> Publications</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockOutBooks.map((book, index) => (
                                <tr key={book._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="w-10 h-12 rounded-sm hover:scale-[3] hover:z-20">
                                                    <img src={book.image} alt={book.bookName} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-xs">{book.bookName}</div>
                                                <div className="text-xs opacity-50">{book.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-xs">
                                        {book.writerName}
                                        <br />
                                        <span className="opacity-60">{book.publications}</span>
                                    </td>
                                    <td>
                                        <p className="text-xs"><span className="text-green-600">{book.quantity}</span></p>
                                    </td>
                                    <td>
                                        <div className="flex gap-1 flex-col">
                                            <button
                                                onClick={() => handleRestock(book._id)}
                                                className="cursor-pointer bg-sky-500 text-xs font-medium rounded hover:bg-sky-700 text-white"
                                            >
                                                Re-Stock
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageStocks;
