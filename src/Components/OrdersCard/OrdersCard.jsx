<div
    className={`border p-5 rounded-lg w-72 space-y-2 shadow-md `}
>
    <h1 className="font-medium">Orders</h1>
    <div className="">
        <p className={`text-xs font-medium `}>Due date: {dueDate}</p>
        <p className={`text-xs font-medium`}>
            Priority level:{" "}
            <span className={`${priorityClass}`}>{priority}</span>
        </p>
        <p className={`text-xs font-medium `}>Status: {status}</p>
        <p className={`text-xs font-medium underline`}>
            Assign to: {assignedTo}
        </p>
    </div>
    <div className="w-full flex justify-end gap-4">
        <button
            className={`w-8 h-8 flex items-center justify-center rounded-full ${areButtonsDisabled()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-yellow-400 text-white"
                } font-medium hover:bg-yellow-600 hover:scale-110 text-xs`}
            onClick={() => document.getElementById(`${id}`).showModal()}
            disabled={areButtonsDisabled()}
        >
            <FaEdit className="text-lg"></FaEdit>
        </button>
        <button
            className={`w-8 h-8 flex items-center justify-center rounded-full ${areButtonsDisabled()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white"
                } font-medium hover:bg-red-600 hover:scale-110 text-xs`}
            onClick={handleDelete}
            disabled={areButtonsDisabled()}
        >
            <FaTrashAlt className="text-lg"></FaTrashAlt>
        </button>

        <button
            onClick={() => {
                handleNavigate(id);
            }}
            className={`py-1 flex gap-1 items-center px-4 rounded-2xl bg-info text-xs text-white font-medium hover:bg-blue-600 hover:scale-105 ${areButtonsDisabled()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : ""
                }`}
            disabled={areButtonsDisabled()}
        >
            Details <FaArrowRight></FaArrowRight>
        </button>
    </div>
    {/* Open the modal using document.getElementById('ID').showModal() method */}
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
            <h1 className="text-center">{title}</h1>
            <form
                onSubmit={handleStatusChange}
                className="md:w-[450px] w-full px-4"
            >
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Status:
                </label>
                <div>
                    <input
                        type="radio"
                        name="status"
                        value="Pending"
                        required
                        className="mr-2"
                    />
                    Pending
                    <input
                        type="radio"
                        name="status"
                        value="In Progress"
                        required
                        className="mr-2 ml-4"
                    />
                    In Progress
                    <input
                        type="radio"
                        name="status"
                        value="Completed"
                        required
                        className="mr-2 ml-4"
                    />
                    Completed
                </div>
                <div className="w-full flex justify-end items-end">
                    <button
                        className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 hover:scale-105"
                        type="submit"
                    >
                        Save
                    </button>
                </div>
            </form>

        </div>
    </dialog>
</div>