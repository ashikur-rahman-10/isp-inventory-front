import React, { useState } from "react";
import UseAxiosSecure from "../../../../Hooks/UseAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { TiTick } from "react-icons/ti";
import Swal from "sweetalert2";

const ManageUsers = () => {
    const [axiosSecure] = UseAxiosSecure();
    const [searchTerm, setSearchTerm] = useState("");

    // Get users
    const { data: users = [], refetch: usersRefetch } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users`);
            return res.data;
        },
    });

    const handleMakeAdmin = async (id, name) => {
        const update = { role: "admin" };
        Swal.fire({
            title: "Are you sure?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            text: `Promote ${name} as an Admin`,
            confirmButtonText: "Yes, Make Admin",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.patch(`/users/role/${id}`, update);
                    if (res.data.success) {
                        Swal.fire({
                            title: "Success!",
                            text: `${name} is now an Admin.`,
                            icon: "success",
                        });
                        usersRefetch();
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to promote the user.",
                        icon: "error",
                    });
                }
            }
        });
    };

    const handleRemoveAdmin = async (id, name) => {
        const update = { role: "buyer" };
        Swal.fire({
            title: "Are you sure?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            text: `Demote ${name}`,
            confirmButtonText: "Yes, Demote",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.patch(`/users/role/${id}`, update);
                    if (res.data.success) {
                        Swal.fire({
                            title: "Success!",
                            text: `${name} has been demoted.`,
                            icon: "success",
                        });
                        usersRefetch();
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: "Failed to demote the user.",
                        icon: "error",
                    });
                }
            }
        });
    };
    // Filter users by search term
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="my-14 lg:my-0">
            <div className="flex my-4 justify-center">
                <input
                    type="text"
                    className="border text-xs rounded-full py-2 px-4 w-72"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto max-w-5xl mx-auto border lg:mb-10">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs">
                        {filteredUsers.map((u, index) => (
                            <tr key={u._id}>
                                <td>{index + 1}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td className="uppercase text-xs">{u.role}</td>
                                <td className="flex flex-col gap-1 w-[130px]">
                                    <Link
                                        to={`/dashboard/user-details/${u.email}`}
                                        className="px-1 py-1 bg-sky-400 text-center hover:bg-sky-600 text-white rounded-full"
                                    >
                                        Details
                                    </Link>
                                    {u.role === "admin" ? (
                                        <button
                                            onClick={() => {
                                                handleRemoveAdmin(u._id, u.name);
                                            }}
                                            className="px-2 py-1 flex items-center gap-1 justify-center bg-red-400 hover:bg-red-600 text-white rounded-full"
                                        >
                                            <span>Admin</span> <FaXmark className="font-bold" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                handleMakeAdmin(u._id, u.name);
                                            }}
                                            className="px-2 py-1 flex items-center gap-1 justify-center bg-green-400 hover:bg-green-600 text-white rounded-full"
                                        >
                                            <span>Admin</span> <TiTick className="text-sm" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
