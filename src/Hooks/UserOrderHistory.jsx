import React from 'react';
import UseAxiosSecure from './UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const UserOrderHistory = (email) => {
    const [axiosSecure] = UseAxiosSecure();
    // get Cart
    const { data: orders = [], refetch: ordersRefetch } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders/${email}`);
            return res.data;
        },
    });
    return { orders, ordersRefetch }
};

export default UserOrderHistory;