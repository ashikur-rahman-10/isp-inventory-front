import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import UseAxiosSecure from '../../../../Hooks/UseAxiosSecure';

const SalesReport = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [salesData, setSalesData] = useState({ salesItem: [] });
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [axiosSecure] = UseAxiosSecure(); // No destructuring needed here

    const handleGenerateReport = async () => {
        if (startDate && endDate) {
            try {
                const adjustedEndDate = new Date(endDate);
                adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
                const adjustedEndDateString = adjustedEndDate
                    .toISOString()
                    .split("T")[0];

                const res = await axiosSecure.get(`/sales-report?startDate=${startDate}&endDate=${adjustedEndDateString}`);
                setSalesData(res.data);
            } catch (error) {
                const errorMessage = error.response ? error.response.data.message : error.message;
                setError(errorMessage);
                console.error("Error fetching sales data:", errorMessage);
            }
        }
    };

    useEffect(() => {
        const handleSort = () => {
            if (salesData.salesItem && salesData.salesItem.length > 0) {
                const sortedSalesData = [...salesData.salesItem].sort((a, b) => {
                    const dateA = new Date(a.orderCreationDate);
                    const dateB = new Date(b.orderCreationDate);
                    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
                });
                setSalesData({ ...salesData, salesItem: sortedSalesData });
            }
        };

        handleSort();
    }, [sortOrder, salesData.salesItem]);

    return (
        <div className="p-6 pt-12 bg-gray-50 min-h-screen">
            <Helmet>
                <title>IHP-INV | Sales Reports</title>
            </Helmet>
            <h2 className="text-2xl font-semibold my-4">Sales Report</h2>
            <div className="flex flex-col md:flex-row md:items-end md:space-x-4 mb-4">
                <div className="mb-2 md:mb-0">
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mb-2 md:mb-0">
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button
                    onClick={handleGenerateReport}
                    className="px-4 py-2 mt-3 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Generate Report
                </button>
            </div>

            {error && <p className="mt-4 text-red-500">{error}</p>}

            {salesData.salesItem.length > 0 ? (
                <div className="mt-6 overflow-x-auto">
                    <h3 className="text-xl font-semibold mb-2">Report from {startDate} to {endDate}</h3>
                    <div className='flex justify-between mb-4'>
                        <p>Total Sales: {salesData.totalSales}tk</p>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="px-4 text-xs py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="asc">Date Asc</option>
                            <option value="desc">Date Des</option>
                        </select>
                    </div>

                    <table className="min-w-full bg-white border border-gray-300 rounded-md">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Order ID</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Client</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Order Date</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Delivered In</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Total Price</th>
                                <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-semibold text-gray-700">Products</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesData.salesItem.map((sale, index) => (
                                <tr key={index}>
                                    <td className="py-2 px-4 border-b border-gray-300 text-xs">{sale.transactionId}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-xs">{sale.client.name}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-xs">{new Date(sale.orderCreationDate).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-xs">{new Date(sale.deliveredIn).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b border-gray-300 text-xs">{sale.totalPrice}</td>
                                    <td className="py-2 px-4 border-b border-gray-300">
                                        <ul>
                                            {sale.products.map((product, productIndex) => (
                                                <li key={productIndex} className="flex items-center space-x-4 mb-2">
                                                    <img src={product.image} alt={product.bookName} className="w-12 h-14 object-cover hidden md:block" />
                                                    <div className="text-xs">
                                                        <p className="font-medium">{product.bookName}</p>
                                                        <p>Price: {product.discountedPrice}</p>
                                                        <p>Quantity: {product.itemCount}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="mt-4 text-red-500 text-center">No sales data available for the selected date range.</p>
            )}
        </div>
    );
};

export default SalesReport;
