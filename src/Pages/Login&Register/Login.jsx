import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Toaster, toast } from "react-hot-toast";
import GoogleLogin from "../../Components/GoogleLogin/GoogleLogin";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../../Hooks/UseAuth";

const Login = () => {
    const [error, setError] = useState("");
    const [show, setShow] = useState(false);
    const { user, login, loginWithGoogle, resetPassword } = useAuth();
    const location = useLocation();
    const from = location?.state?.pathname || "/";
    const navigate = useNavigate();


    const handleSubmit = (event) => {
        event.preventDefault();
        setError('')
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        login(email, password)
            .then((result) => {
                const loggedUser = result.user;
                toast.success("Successfully Login!");
                setError("");
                navigate(from);
                window.location.reload()
                event.target.reset();
            })
            .catch((error) => {
                console.log(error.message);
                setError(error.message);
            });
    };

    const handleResetPassword = () => {
        Swal.fire({
            title: 'Enter your email address',
            input: 'email',
            inputPlaceholder: 'Email address',
            showCancelButton: true,
            confirmButtonText: 'Send reset link',
            preConfirm: (email) => {
                return resetPassword(email)
                    .then(() => {
                        Swal.fire({
                            icon: "success",
                            text: "Password reset email sent successfully",
                            title: "Please check your email account.",
                            showConfirmButton: false,
                            timer: 3000,
                        });
                    })
                    .catch((error) => {
                        Swal.showValidationMessage(`Request failed: ${error.message}`);
                    });
            },
        });
    };

    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: "The email or password you entered is incorrect. Try again.",
            });


        }
    }, [error]);

    if (user) {
        window.location.replace('https://bornomala-mart.web.app/')
    }

    // Scroll to top
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
    });
    return (
        <div className="w-full flex items-center justify-center min-h-[91vh]">
            <form
                onSubmit={handleSubmit}
                className="border shadow-xl rounded-2xl py-10 px-8  md:max-w-[396px] w-full mx-auto "
            >
                <h1 className="text-3xl text-center font-medium mb-8">Login</h1>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        type="email"
                        placeholder="email"
                        name="email"
                        required
                        className="input input-bordered input-success focus:outline-none  w-full"
                    />
                </div>
                <div className="form-control relative">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input
                        type={show ? "text" : "password"}
                        placeholder="password"
                        name="password"
                        required
                        className=" input input-bordered input-success  focus:outline-none   w-full"
                    />
                    <div onClick={() => { setShow(!show) }} className="absolute bottom-4 right-4 cursor-pointer text-xl hover:text-red-700">
                        {
                            show ? <FaEye></FaEye> : <FaEyeSlash></FaEyeSlash>
                        }
                    </div>
                </div>
                <span className="w-full flex justify-center mt-4">
                    <small className="text-red-600">{error}</small>
                </span>
                <input
                    className="bg-[#149352] cursor-pointer text-white py-[10px] rounded-3xl mt-4 hover:bg-transparent hover:text-[#149352] hover:outline outline-[#149352] font-medium w-full"
                    type="submit"
                    value="Login"
                />
                <div className="w-full text-center mt-4">
                    <button
                        type="button"
                        className="text-info underline"
                        onClick={handleResetPassword}
                    >
                        Forgot Password?
                    </button>
                </div>
                <div className="divider">OR</div>
                <GoogleLogin></GoogleLogin>
                <span className="flex w-full justify-center mt-3">
                    <small className="text-center">
                        Dont’t Have An Account?{" "}
                        <Link
                            to={"/register"}
                            className="text-warning underline"
                        >
                            Register
                        </Link>
                    </small>
                </span>
            </form>
            <Toaster></Toaster>
        </div>
    );
};

export default Login;
