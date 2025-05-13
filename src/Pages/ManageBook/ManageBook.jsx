import React, { useState } from "react";
import Swal from "sweetalert2";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import useBooks from "../../Hooks/UseBooks";
import EditBook from "../../Components/EditBook/EditBook";

const ManageBook = () => {
  const [axiosSecure] = UseAxiosSecure();
  const [showModal, setShowModal] = useState(false);
  const [modalID, setModalID] = useState(null);

  // get all Books
  const { books, booksRefetch } = useBooks();
  // Function to handle book deletion
  const handleDeleteBook = async (bookId) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    // If user confirms deletion
    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/books/${bookId}`);
        // If deletion is successful, refetch the books data
        await booksRefetch();
        // Show success message
        Swal.fire("Deleted!", "Your book has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting book:", error);
        // Show error message
        Swal.fire("Error!", "Failed to delete book.", "error");
      }
    }
  };

  const handleOpenModal = (_id) => {
    setModalID(_id);
    setShowModal(true);
  };
  return (
    <div className="p-4">
      <h1 className="text-center font-medium text-lg underline text-green-900">
        All books : {books?.length}
      </h1>
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
                  Price 
                </th>
                <th>
                  Writer
                </th>
                <th>
                  Quantity 
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className=" w-10 h-12 rounded-sm hover:scale-[3] hover:z-20">
                          <img src={b?.image} alt={b?.bookName} />
                        </div>
                      </div>
                     
                        <div className="font-bold text-xs">{b?.bookName}</div>
                      </div>
                  
                  </td>
                  <td className="text-xs">
                    {b?.writerName}
                    <br />
                  </td>
                  <td className="text-xs">
                    TK.{b?.price}
                    <br />
                  </td>
                  <td>
                    <p className="text-xs">
                      <span className="text-green-600">{b?.quantity}</span>
                    </p>
                  </td>
                  <td>
                    <div className="flex gap-1 flex-col">
                      <button
                        className="cursor-pointer bg-red-500 text-xs font-medium rounded hover:bg-red-700 text-white"
                        onClick={() => handleDeleteBook(b?._id)}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          handleOpenModal(b._id);
                        }}
                        className="cursor-pointer bg-sky-500 text-xs font-medium rounded hover:bg-sky-700 text-white"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed z-10 inset-0 flex items-center justify-center h-screen bg-gray-500 bg-opacity-40 ">
          <div className="modal-box md:w-11/12 w-full max-w-5xl">
            <form method="dialog">
              {/* Close button */}
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </form>
            {/* EditBook component */}
            <EditBook
              id={modalID}
              setShowModal={setShowModal}
              booksRefetch={booksRefetch}
            ></EditBook>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBook;
