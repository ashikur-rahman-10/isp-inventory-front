import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import useBooks from "../../Hooks/UseBooks";

const ManageStocks = () => {
  const [axiosSecure] = UseAxiosSecure();
  const [stockOutBooks, setStockOutBooks] = useState([]);
  const { books, booksRefetch } = useBooks();

  useEffect(() => {
    const stockOutBooks = books.filter((b) => b.quantity <= 5);
    setStockOutBooks(stockOutBooks);
  }, [books]);

const handleRestock = (bookId) => {
  Swal.fire({
    title: "Submit Quantity You Want To ADD",
    input: "number",
    inputAttributes: {
      min: 1, // Optional HTML input validation
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Restock",
    cancelButtonText: "Cancel",
    buttonsStyling: false,
    customClass: {
      cancelButton: "bg-red-500 text-white px-5 py-2 rounded ml-5",
      confirmButton: "bg-blue-500 text-white px-5 py-2 rounded mr-5",
    },
    showLoaderOnConfirm: true,
    preConfirm: async (quantity) => {
      // Convert input to number
      const restockQuantity = parseInt(quantity, 10);

      // Validate quantity
      if (!restockQuantity || restockQuantity <= 0) {
        Swal.showValidationMessage("Please enter a valid quantity greater than 0");
        return false;
      }

      const data = { quantity: restockQuantity };

      return axiosSecure
        .patch(`/books/restock/${bookId}`, data)
        .then((response) => {
          if (response.data.acknowledged) {
            booksRefetch();
            Swal.fire({
              icon: "success",
              title: "Book Edited Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            throw new Error("Failed to update stock");
          }
        })
        .catch((error) => {
          Swal.showValidationMessage(`Request failed: ${error.message}`);
        });
    },
    allowOutsideClick: () => !Swal.isLoading(),
  });
};


  return (
    <div className="p-4">
      <div>
        <div className="overflow-x-auto py-8">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>
                  Name 
                </th>
                <th>
                  Writer
                </th>
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
                        <div className="text-xs opacity-50">
                          {book.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-xs">
                    {book.writerName}
                    <br />
                    <span className="opacity-60">{book.publications}</span>
                  </td>
                  <td>
                    <p className="text-xs">
                      <span className="text-green-600">{book.quantity}</span>
                    </p>
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
