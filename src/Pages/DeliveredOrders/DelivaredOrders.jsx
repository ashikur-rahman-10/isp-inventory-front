import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { RiNewspaperLine } from 'react-icons/ri';
import UseOrderByStatus from '../../../../Hooks/UseOrderByStatus';

const DeliveredOrders = () => {
    const { orders, ordersRefetch } = UseOrderByStatus("Delivered");
    const [sortBy, setSortBy] = useState('');

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const handleSort = () => {
        const sortedOrders = [...orders];
        if (sortBy === 'dateAsc') {
            sortedOrders.sort((a, b) => new Date(a.orderCreationDate) - new Date(b.orderCreationDate));
        } else if (sortBy === 'dateDesc') {
            sortedOrders.sort((a, b) => new Date(b.orderCreationDate) - new Date(a.orderCreationDate));
        } else if (sortBy === 'priceAsc') {
            sortedOrders.sort((a, b) => a.totalPrice - b.totalPrice);
        } else if (sortBy === 'priceDesc') {
            sortedOrders.sort((a, b) => b.totalPrice - a.totalPrice);
        }
        return sortedOrders;
    };

    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        };
        return dateObj.toLocaleString('en-US', options);
    };

    return (
        <div className='py-12 lg:py-0 bg-gray-50 px-4 min-h-screen'>
            <h1 className='text-center text-2xl text-gray-400 font-semibold pt-10 font-mono'>Delivered: {orders?.length} Orders</h1>

            <div className='flex justify-end px-4 md:px=8 my-4'>
                <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className='p-1 text-xs border border-gray-400 rounded-md'
                >
                    <option value="">Sort By</option>
                    <option value="dateAsc">Date (Ascending)</option>
                    <option value="dateDesc">Date (Descending)</option>
                    <option value="priceAsc">Price (Low to High)</option>
                    <option value="priceDesc">Price (High to Low)</option>
                </select>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto w-fit text-xs py-10'>
                {handleSort().map(order => (
                    <div key={order._id} className='relative w-[360px] md:w-[300px] h-52 bg-white rounded-lg p-4 shadow-sm shadow-green-400 border-r-4 border-b-4 border-green-400'>
                        <div className='pb-2'>
                            <p className='text-gray-400'>Customer: <span className='text-black'>{order?.client.name}</span></p>
                            <p className='text-gray-400'>TransactionID: <Link to={`/dashboard/order/${order?.transactionId}`} className='text-sky-400 font-semibold'>{order?.transactionId}</Link></p>
                            <div className='flex justify-between'>
                                <p className='text-gray-400'>Price: <span className='text-green-500 font-semibold text-sm'>{order?.totalPrice}tk</span></p>
                            </div>
                        </div>
                        {order?.products?.map((p, index) => (
                            <ul key={index} className='list-disc'>
                                <li className='flex justify-between items-center font-medium border-b'>
                                    <p>{index + 1}. {p.bookName}</p> <p>{p?.itemCount}pcs</p>
                                </li>
                            </ul>
                        ))}
                        <div className='absolute left-4 bottom-4 flex'>
                            <p className='bg-white text-green-500 font-semibold'>Delivered In: <br /> {formatDate(order?.deliveredIn)}</p>
                        </div>
                        <div className='absolute right-4 bottom-4 flex'>
                            <Link to={`/dashboard/order-details/${order.transactionId}`} className='bg-blue-400 px-2 py-1 rounded-md text-white uppercase font-medium hover:bg-blue-600 flex items-center gap-1 text-md'>Details <RiNewspaperLine /></Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeliveredOrders;
