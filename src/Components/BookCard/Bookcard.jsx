import toast, { Toaster } from "react-hot-toast";

const Bookcard = ({ book }) => {
  const { bookName, image, writerName, price} = book;

  return (
    <div
      className="relative w-fit"
    >
      <div className="flex flex-col justify-center items-center h-72 w-44 border border-b-green-600 border-r-green-600  hover:shadow-xl shadow-sm rounded-sm p-2">
        <img className="w-[120px] h-44 mb-2" src={image} alt={bookName} />
        <h1 className="text-[13px] font-bold">{bookName}</h1>
        <p className="text-[11px] line-clamp-1">{writerName}</p>
        <div className="flex gap-2 text-xs font-medium">
          <p className="text-green-500">TK.{price}</p>
        </div>        
      </div>
      <Toaster></Toaster>
    </div>
  );
};

export default Bookcard;
