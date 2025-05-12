import React from 'react';
import Swal from 'sweetalert2';
import UseAxiosSecure from './UseAxiosSecure';
import useAuth from './UseAuth';
import UseCart from './UseCart';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const UseHandleAddCart = (book) => {
    const [axiosSecure] = UseAxiosSecure();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { bookName, _id } = book;
    const { cartRefetch } = UseCart(user?.email);

    const handleAddCart = () => {
        if (!user) {
            // User is not logged in, show alert and navigate to login page
            Swal.fire({
                title: "Login Required",
                text: "Please login to add items to the cart.",
                icon: "warning",
                confirmButtonText: "Login",
                showCancelButton: true,
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirect to login page
                    navigate("/login", { state:  location  });
                }
            });
        } else {
            const item = {
                bookName,
                userEmail: user.email,
                userName: user.displayName,
                bookId: _id,
            };
    
            axiosSecure.post("/carts", item).then((data) => {
                if (data.data.acknowledged) {
                    Swal.fire({
                        title: "",
                        text: "Book Added To Cart",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1000
                    });
                    cartRefetch();
                }
            });
        }
    };

    return { handleAddCart };
};

export default UseHandleAddCart;
