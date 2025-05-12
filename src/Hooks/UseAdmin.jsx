import React, { useEffect, useState } from 'react';
import UseAxiosSecure from './UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import useAuth from './UseAuth';

const UseAdmin = () => {
    const [admin, setAdmin] = useState(false);
    const [adminLoading, setAdminLoading] = useState(true);
    const { user } = useAuth();
    const [axiosSecure] = UseAxiosSecure();

    // Get Users
    const { data: users = [], refetch: usersRefetch } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users`);
            return res.data;
        },
    });

    useEffect(() => {
        setAdminLoading(true); // Set loading state to true initially

        const thisUser = users.find((u) => user?.email === u.email);
        if (thisUser?.role === "admin") {
            setAdmin(true);
        }

        setAdminLoading(false); // Update loading state after determining admin status
    }, [users, user]);

    return { admin, adminLoading, usersRefetch };
};

export default UseAdmin;
