import React from 'react';
import UseAxiosSecure from './UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const UseCart = (email) => {
    const [axiosSecure] = UseAxiosSecure();
    // get Cart
    const { data: cart = [], refetch: cartRefetch } = useQuery({
        queryKey: ["cart"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/carts/${email}`);
            return res.data;
        },
    });
    return {cart,cartRefetch}
};

export default UseCart;