import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/UseAuth";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";


const AddBook = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [axiosSecure] = UseAxiosSecure();


  // get writers
  const { data: writers = [], refetch: writersRefetch } = useQuery({
    queryKey: ["writers"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/writers`);
      setLoading(false);
      return res.data;
    },
  });

  // Add new Writer
  const handleAddNewWriter = (event) => {
    event.preventDefault();
    const newWriterValue = event.target.newWriter.value;
    const token = localStorage.getItem("access-token");
    fetch("https://bornomala-boighor-server.vercel.app/writers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ writerName: newWriterValue }), // Corrected the object key here
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          writersRefetch();
          toast.success("Successfully Added");
        }
      });

    setShowModal3(false); // Close modal after adding category
  };

 
  // Handle Writer Search
  const handleWriterSearch = (event) => {
    const query = event.target.value ? event.target.value.toLowerCase() : "";
    const filteredWriter = writers.filter(
      (writer) =>
        writer &&
        writer.writerName &&
        writer.writerName.toLowerCase().includes(query)
    );
    setSearchResults(filteredWriter);
    setShowDropdown(true);
  };

  // Handle Form input
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Set Writer Value
  const handleWriterDropdown = (writer) => {
    setValue("writerName", writer, { shouldValidate: true });

    setShowDropdown(false);
  };

  const imageHostingUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOSTING_KEY
    }`;

  const onSubmit = (data) => {
    setUploadLoading(true)
    const formData = new FormData();
    formData.append("image", data.image[0]);
    fetch(imageHostingUrl, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgResponse) => {
        if (imgResponse.success) {
          const imgUrl = imgResponse.data.display_url;
          const {
            bookName,
            category,
            writerName,
            publications,
            price,
            discounts,
            quantity,
            descriptions,
            bookName_en, keywords,
            buyingPrice
          } = data;
          const addedBook = {
            bookName,
            price: parseInt(price),
            quantity: parseInt(quantity),
            image: imgUrl,
            discounts,
            addedBy: user.displayName,
            sold: 0,
            viewCount: 0,
            category,
            writerName,
            publications,
            descriptions,
            bookName_en,
            keywords,
            buyingPrice
          };


          axiosSecure.post("/books", addedBook).then((data) => {
            if (data.data.acknowledged) {
              setUploadLoading(false)
              Swal.fire({
                icon: "success",
                title: "Book Added Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              // navigate("/dashboard/myclasses");
              reset();
            }
          });
        }
      });
  };

  if (uploadLoading) {
    return <div className="w-full flex flex-col gap-4 items-center justify-center min-h-[95vh] absolute bg-white z-10 px-5 lg:pr-80 ">
      <img src={waitAminute} alt="" />
      <h1 className="text-gray-500 text-2xl font-mono font-semibold">Uploading...</h1>
    </div>
  }

  // Scroll to top
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });

  return (
    <div className="flex flex-col w-full items-center">
      <h1 className="text-center md:pb-4 text-2xl">Add a Book to your shop</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-fit  rounded-lg shadow-md flex flex-col justify-center items-center p-8 mb-8 text-sm"
      >
 
           <fieldset className="fieldset">
             <label className="label">
              <span className="text-xs text-[#757575dc] font-medium">
                Book name
              </span>
            </label>
            <input
              type="text"
              placeholder="book name"
              {...register("bookName", { required: true })}
              className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-[300px]"
            />

               <div className="relative">
              <input
                type="text"
                placeholder="Search Writer name"
                {...register("writerName", { required: true })}
                className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-[300px]"
                onChange={handleWriterSearch}
              />
              <button
                onClick={() => setShowModal3(true)}
                className="absolute inset-y-0 right-0 px-4 py-1  bg-blue-500 text-white "
              >
                New
              </button>
            </div>
         

            {showDropdown && (
              <span className="relative">
              
                {searchResults.length > 0 && (
                  
                  <div className="absolute z-10  md:w-[380px] w-[300px] max-h-72 overflow-y-scroll bg-white border border-gray-200 rounded-sm shadow-md">
                      <button onClick={()=>{setShowDropdown(false)
                }} className="px-[11px] text-base py-[4px] hover:bg-slate-100 hover:text-red-400 -top-0 right-0 rounded-full border border-red-500 absolute z-40  font-bold">X</button>
                    {searchResults.map((result) => (
                      <div
                      key={result._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleWriterDropdown(result.writerName)}
                      >
                        {result.writerName}
                      </div>
                    ))}
                  </div>
                )}
              </span>
            )}


            <label className="label">
              <span className="text-xs text-[#757575] font-medium ">Photo</span>
            </label>
            <input
              type="file"
              {...register("image", { required: true })}
              className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-[300px]"
            />



            <label className="label">
              <span className="text-xs text-[#757575] font-medium ">Price</span>
            </label>
            <input
              type="number"
              placeholder="price"
              {...register("price")}
              className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-[300px]"
            />


            <label className="label">
              <span className="text-xs text-[#757575] font-medium ">Buying Price</span>
            </label>
            <input
              type="number"
              placeholder="buying price"
              {...register("buyingPrice")}
              className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-[300px]"
            />


            <label className="label">
              <span className="text-xs text-[#757575] font-medium ">
                Quantity
              </span>
            </label>
            <input
              type="number"
              placeholder="quantity"
              {...register("quantity", { required: true })}
              className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-[300px]"
            />


   
            <label className="label">
              <span className="text-xs text-[#757575] font-medium ">
                Keywords
              </span>
            </label>
            <textarea
              type="text"
              placeholder="keywords"
              {...register("keywords")}
              className="border border-success rounded-sm p-1 focus:outline-none lg:w-[350px] w-[300px]"
            />

     

           </fieldset>
        <input
          type="submit"
          value={"Save"}
          className="border border-success py-1 px-10 mt-4 rounded-xl cursor-pointer hover:scale-110 duration-300 hover:bg-success hover:text-white hover:border-warning"
        />
      </form>

      {/* Modal */}
      {showModal1 && (
        <form
          onSubmit={handleAddNewCategory}
          className="fixed z-30 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
        >
          <div className="bg-white p-4 rounded-md flex gap-3 flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-2">Add New Category</h2>
            <input
              type="text"
              name="newCategory"
              className="border border-gray-300 rounded-md p-2 mb-2  w-72"
              placeholder="Enter category name"
            />
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Add
              </button>
              <button
                onClick={() => setShowModal1(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {showModal2 && (
        <form
          onSubmit={handleAddNewPublication}
          className="fixed z-30 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
        >
          <div className="bg-white p-4 rounded-md flex gap-3 flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-2">Add New Publication</h2>
            <input
              type="text"
              name="newPublication"
              className="border border-gray-300 rounded-md p-2 mb-2  w-72"
              placeholder="Enter publicaton name"
            />
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Add
              </button>
              <button
                onClick={() => setShowModal2(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
      {showModal3 && (
        <form
          onSubmit={handleAddNewWriter}
          className="fixed z-30 inset-0 flex items-center justify-center bg-gray-300 bg-opacity-50"
        >
          <div className="bg-white md:w-[450px] w-96 p-4 rounded-md flex gap-3 flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-2">Add New Writer</h2>
            <input
              type="text"
              name="newWriter"
              className="border border-green-500 rounded-md p-2 mb-2 md:w-[400px]  w-80"
              placeholder="Enter Writers name"
            />
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Add
              </button>
              <button
                onClick={() => setShowModal3(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
      <Toaster></Toaster>
    </div>
  );
};

export default AddBook;
