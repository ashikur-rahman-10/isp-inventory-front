import React from 'react';
import UseAxiosSecure from './UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const UseBlogs = () => {
    const [axiosSecure] = UseAxiosSecure();
    // Get blogs
    const { data: blogs = null, refetch: blogsRefetch } = useQuery({
        queryKey: ["blogs"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/blogs`);
            return res.data;
        },
    });
    return { blogs, blogsRefetch }
};

export default UseBlogs;