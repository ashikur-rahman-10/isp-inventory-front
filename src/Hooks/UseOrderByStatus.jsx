import React from 'react';
import UseAxiosSecure from './UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const UseOrderByStatus = (status) => {
    const [axiosSecure] = UseAxiosSecure();
    // get Orders
    const { data: orders = [], refetch: ordersRefetch } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders/status/${status}`);
            return res.data;
        },
    });
    return { orders, ordersRefetch }
};

export default UseOrderByStatus;