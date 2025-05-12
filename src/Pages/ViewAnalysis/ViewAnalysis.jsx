import React, { useState } from 'react';
import UseAxiosSecure from '../../../../Hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import UseAllBooks from '../../../../Hooks/UseAllBooks';

const ViewAnalysis = () => {
    const [axiosSecure] = UseAxiosSecure();
    const { books } = UseAllBooks();

    const [filterIp, setFilterIp] = useState('');
    const [filterBookName, setFilterBookName] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    // Get booksViews
    const { data: bookViews = [], refetch: bookViewsRefetch } = useQuery({
        queryKey: ["bookViews"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/book/view`);
            return res.data;
        },
    });

    const getBookCategory = (bookId) => {
        const book = books.find(b => b._id === bookId);
        return book ? book.category : 'Unknown Category';
    };


    const filteredBookViews = bookViews.filter(view => {
        const bookCategory = getBookCategory(view.bookId);
        const matchesIp = filterIp ? view.ipAddress === filterIp : true;
        const matchesBookName = filterBookName ? view.bookName === filterBookName : true;
        const matchesCategory = filterCategory ? bookCategory === filterCategory : true;
        return matchesIp && matchesBookName && matchesCategory;
    });

    // Handle click on IP address
    const handleIpClick = (ip) => {
        setFilterIp(ip === filterIp ? '' : ip);
    };

    // Handle click on Book Name
    const handleBookNameClick = (bookName) => {
        setFilterBookName(bookName === filterBookName ? '' : bookName);
    };

    // Handle click on Category
    const handleCategoryClick = (category) => {
        setFilterCategory(category === filterCategory ? '' : category);
    };

    return (
        <div className='px-2 md:px-4 mt-14 lg:mt-0'>
            <h2 className="text-lg font-medium text-gray-500 text-center py-4">Book Views</h2>

            {(filterIp || filterBookName || filterCategory) && <div className="mb-4 text-xs">
                {filterIp && <span className="bg-gray-200 px-2 py-1 rounded mr-2">Filtered by IP: {filterIp}</span>}
                {filterBookName && <span className="bg-gray-200 px-2 py-1 rounded mr-2">Filtered by Book: {filterBookName}</span>}
                {filterCategory && <span className="bg-gray-200 px-2 py-1 rounded">Filtered by Category: {filterCategory}</span>}


                {(filterIp || filterBookName || filterCategory) && (
                    <button
                        onClick={() => { setFilterIp(''); setFilterBookName(''); setFilterCategory(''); }}
                        className="ml-2 bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded">
                        Clear Filters
                    </button>
                )}
            </div>}

            <div className="overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-400 w-full text-xs">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-400 px-4 py-2">#</th>
                            <th className="border border-gray-400 px-4 py-2 w-40">Book Name</th>
                            <th className="border border-gray-400 px-4 py-2 w-40">Category</th>
                            <th className="border border-gray-400 px-4 py-2">IP Address</th>
                            <th className="border border-gray-400 px-4 py-2">Viewed At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookViews.map((view, index) => (
                            <tr key={view._id}>
                                <td className="border border-gray-400 px-4 w-10 py-2">{index + 1}</td>
                                <td
                                    className="border border-gray-400 px-4 py-2 text-blue-500 cursor-pointer w-40 whitespace-nowrap"
                                    onClick={() => handleBookNameClick(view.bookName)}
                                >
                                    {view.bookName}
                                </td>
                                <td
                                    className="border border-gray-400 px-4 py-2 text-blue-500 cursor-pointer w-40 whitespace-nowrap"
                                    onClick={() => handleCategoryClick(getBookCategory(view.bookId))}
                                >
                                    {getBookCategory(view.bookId)}
                                </td>
                                <td
                                    className="border border-gray-400 px-4 py-2 w-40 text-blue-500 cursor-pointer"
                                    onClick={() => handleIpClick(view.ipAddress)}
                                >
                                    {view.ipAddress}
                                </td>
                                <td className="border border-gray-400 px-4 py-2 md:w-40">{new Date(view.viewedAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewAnalysis;
