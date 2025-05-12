import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaBox, FaCarAlt, FaCarBattery, FaPlus, FaTruck, FaUsers } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { LuClipboardList } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { MdOutlineManageHistory } from 'react-icons/md';
import { PiEmptyBold } from 'react-icons/pi';
import UseAxiosSecure from '../../../../Hooks/UseAxiosSecure';
import Greeting from '../../../../Components/Greetings/Greetings';

const AdminDashBoard = () => {
    const [pending, setPending] = useState([])
    const [toShipped, setToShipped] = useState([])
    const [delivered, setDelivared] = useState([])
    const [canceled, setcaceled] = useState([])

    const [axiosSecure] = UseAxiosSecure();
    // get orders
    const { data: orders = [], refetch: ordersRefetch } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders`);
            return res.data;
        },
    });

    useEffect(() => {

        const ProcessingOrders = orders.filter(order => order.orderStatus == "Processing")
        const toShip = orders.filter(order => order.orderStatus == "To-Shipped")
        const deliverd = orders.filter(order => order.orderStatus == "Delivered")
        const canceled = orders.filter(order => order.orderStatus == "Canceled")

        setPending(ProcessingOrders);
        setToShipped(toShip);
        setDelivared(deliverd);
        setcaceled(canceled);

    }, [orders])

    return (
        <div className='bg-[#f9fbfd] w-full min-h-screen'>

            <div className='flex w-full flex-col-reverse border md:flex-row px-4 justify-between items-center'>
                <Greeting></Greeting>
                <img className='w-80' src="https://i.ibb.co/r34mMw9/user-interface.gif" />
            </div>
            {/* Orders */}
            <div className='w-fit mx-auto px-4 mt-4'>
                <h1 className='text-2xl text-gray-500 py-6 text-center uppercase'>Manage Orders</h1>
                <div className='grid grid-cols-2 md:grid-cols-4 md:gap-5 gap-2 w-fit mx-auto'>
                    <Link to={'/dashboard/new-orders'} className='bg-white hover:shadow-lg hover:scale-90 duration-300 text-sky-400 w-[184px] md:h-32 h-28 md:w-52 rounded-xl flex flex-col items-center gap-2 justify-center border-b-4  border-r-4 shadow-md  border-sky-400'>
                        <div className='flex items-center justify-center gap-3'>
                            <div className=' bg-sky-200  w-8 h-8  p-2 rounded-full flex items-center justify-center'>
                                <LuClipboardList className='text-sky-400' />
                            </div>
                            <p className='text-5xl'>{pending?.length}</p>
                        </div>
                        <p className='text-xl font-medium  text-center'>
                            New Orders
                        </p>
                    </Link>

                    <Link to={"/dashboard/to-shipped"} className='bg-white hover:shadow-lg hover:scale-90 duration-300 text-yellow-400 w-[184px] md:h-32 h-28 md:w-52 rounded-xl flex flex-col items-center gap-2 justify-center border-b-4  border-r-4 shadow-md  border-yellow-400'>
                        <div className='flex items-center justify-center gap-3'>
                            <div className=' bg-yellow-200  w-8 h-8  p-2 rounded-full flex items-center justify-center'>
                                <FaTruck className='text-yellow-400' />
                            </div>
                            <p className='text-5xl'>{toShipped?.length}</p>
                        </div>
                        <p className='text-xl font-medium  text-center'>
                            To Shipped
                        </p>
                    </Link>

                    <Link to={"/dashboard/delivered"} className='bg-white hover:shadow-lg hover:scale-90 duration-300 text-green-400 w-[184px] md:h-32 h-28 md:w-52 rounded-xl flex flex-col items-center gap-2 justify-center border-b-4  border-r-4 shadow-md  border-success'>
                        <div className='flex items-center justify-center gap-3'>
                            <div className=' bg-green-200  w-8 h-8  p-2 rounded-full flex items-center justify-center'>
                                <FaBox className='text-green-400' />
                            </div>
                            <p className='text-5xl'>{delivered?.length}</p>
                        </div>
                        <p className='text-xl font-medium  text-center'>
                            Delivered
                        </p>
                    </Link>


                    <Link to={'/dashboard/canceled'} className='bg-white hover:shadow-lg hover:scale-90 duration-300 text-red-400 w-[184px] md:h-32 h-28 md:w-52 rounded-xl flex flex-col items-center gap-2 justify-center border-b-4  border-r-4 shadow-md  border-red-400'>
                        <div className='flex items-center justify-center gap-3'>
                            <div className=' bg-red-200  w-8 h-8  p-2 rounded-full flex items-center justify-center'>
                                <FaXmark className='text-red-400' />
                            </div>
                            <p className='text-5xl'>{canceled?.length}</p>
                        </div>
                        <p className='text-xl font-medium  text-center'>
                            Canceled
                        </p>
                    </Link>
                </div>
            </div>

            {/* Manage Books */}

            <div className='w-fit mx-auto px-4 mt-4 pb-20'>
                <h1 className='text-2xl text-gray-500 py-6 text-center uppercase'>Manage Books</h1>
                <div className='grid grid-cols-2 md:grid-cols-4 md:gap-5 gap-2 w-fit mx-auto'>
                    <Link to={'/dashboard/add-book'} className='bg-white hover:shadow-lg hover:scale-90 duration-300 text-sky-400 w-[184px] md:h-32 h-28 md:w-52 rounded-xl flex flex-col items-center gap-2 justify-center border-b-4  border-r-4 shadow-md  border-sky-400'>
                        <div className='flex items-center justify-center gap-3'>
                            <div className=' bg-sky-200  w-8 h-8  p-2 rounded-full flex items-center justify-center'>
                                <FaPlus className='text-sky-400' />
                            </div>

                        </div>
                        <p className='text-xl font-medium  text-center'>
                            Add New Book
                        </p>
                    </Link>

                    <Link to={"/dashboard/manage-books"} className='bg-white hover:shadow-lg hover:scale-90 duration-300 text-yellow-400 w-[184px] md:h-32 h-28 md:w-52 rounded-xl flex flex-col items-center gap-2 justify-center border-b-4  border-r-4 shadow-md  border-yellow-400'>
                        <div className='flex items-center justify-center gap-3'>
                            <div className=' bg-yellow-200  w-8 h-8  p-2 rounded-full flex items-center justify-center'>
                                <MdOutlineManageHistory className='text-yellow-400' />
                            </div>

                        </div>
                        <p className='text-xl font-medium  text-center'>
                            Manage Stocks
                        </p>
                    </Link>

                    <Link to={"/dashboard/manage-stocks"} className='bg-white hover:shadow-lg hover:scale-90 duration-300 text-red-400 w-[184px] md:h-32 h-28 md:w-52 rounded-xl flex flex-col items-center gap-2 justify-center border-b-4  border-r-4 shadow-md  border-red-400'>
                        <div className='flex items-center justify-center gap-3'>
                            <div className=' bg-red-200  w-8 h-8  p-2 rounded-full flex items-center justify-center'>
                                <PiEmptyBold className='text-red-400' />
                            </div>

                        </div>
                        <p className='text-xl font-medium  text-center'>
                            Stock Out Books
                        </p>
                    </Link>
                    <Link to={"/dashboard/manage-users"} className='bg-white hover:shadow-lg hover:scale-90 duration-300 text-purple-400 w-[184px] md:h-32 h-28 md:w-52 rounded-xl flex flex-col items-center gap-2 justify-center border-b-4  border-r-4 shadow-md  border-purple-400'>
                        <div className='flex items-center justify-center gap-3'>
                            <div className=' bg-purple-200  w-8 h-8  p-2 rounded-full flex items-center justify-center'>
                                <FaUsers className='text-purple-400' />
                            </div>

                        </div>
                        <p className='text-xl font-medium  text-center'>
                            Manage Users
                        </p>
                    </Link>
                </div>
            </div>


        </div>
    );
};

export default AdminDashBoard;