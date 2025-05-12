import { useEffect, useState } from 'react';
import useAuth from './UseAuth';
import UseAxiosSecure from './UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useThisUser = () => {
    const { user } = useAuth();
    const [axiosSecure] = UseAxiosSecure();
    const [clientLoading, setClientLoading] = useState(true);
    const [client, setClient] = useState([]);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                try {
                    const res = await axiosSecure.get(`/users/${user.email}`);
                    setClient(res.data);
                    setClientLoading(false);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchData();
        }
    }, []);

    return { client, clientLoading };
};

export default useThisUser;
