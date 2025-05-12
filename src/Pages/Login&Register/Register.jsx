import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import wait from "../../assets/please_wait.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import GoogleLogin from "../../Components/GoogleLogin/GoogleLogin";
import useAuth from "../../Hooks/UseAuth";

const Register = () => {
    const [error, setError] = useState("");
    const { createUser, updateUser, logout, verification, user } = useAuth();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [creating, setCreating] = useState(false);
    const imageHostingUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_HOSTING_KEY}`;

    const { register, handleSubmit, formState: { errors } } = useForm();


    const onSubmit = async (data) => {
        setError("");
        const { name, email, password, gender, phone } = data;
        setCreating(true);
        const formData = new FormData();
        formData.append("image", data.image[0]);

        try {
            const res = await fetch(imageHostingUrl, {
                method: "POST",
                body: formData,
            });
            const imgResponse = await res.json();
            if (imgResponse.success) {
                const imgUrl = imgResponse.data.display_url;
                const savedUser = {
                    name,
                    email,
                    photoURL: imgUrl,
                    gender,
                    phone,
                    role: "buyer",
                };

                try {
                    const result = await createUser(email, password);
                    const loggedUser = result.user;

                    const token = localStorage.getItem("access-token");

                    // Check if user is authenticated
                    if (loggedUser) {
                        await updateUser(name, imgUrl);
                        await verification(loggedUser);

                        // Send savedUser to your server
                        const response = await fetch("https://bornomala-boighor-server.vercel.app/users", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: token ? `Bearer ${token}` : "",
                            },
                            body: JSON.stringify(savedUser),
                        });

                        if (response.ok) {
                            Swal.fire({
                                icon: "success",
                                title: "User Created Successfully. Please check your email to verify your account.",
                                showConfirmButton: false,
                                timer: 3000,
                            });
                            await logout();
                            navigate("/login");
                        } else {
                            throw new Error("Failed to save user data to the server.");
                        }
                    } else {
                        throw new Error("User is not authenticated.");
                    }
                } catch (verificationError) {
                    console.error("Verification email failed to send:", verificationError);
                    setError("Verification email failed to send.");
                }
            } else {
                throw new Error("Image upload failed");
            }
        } catch (error) {
            console.error("Error:", error.message);
            setError(error.message);
        } finally {
            setCreating(false);
        }
    };





    useEffect(() => {
        if (error) {
            Swal.fire({
                icon: "error",
                text: error,
                timer: 3000,
            });
        }
    }, [error]);

    if (creating && !error) {
        return (
            <div className="fixed top-0 z-40 bg-white w-full min-h-screen flex items-center justify-center">
                <img className="w-[300px]" src={wait} alt="Please wait" />
            </div>
        );
    }

    if (user) {
        window.location.replace('https://bornomala-mart.web.app/');
    }

    // Scroll to top
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
    });

    return (
        <div className="w-full flex items-center justify-center min-h-[80vh]">
            <form onSubmit={handleSubmit(onSubmit)} className="border shadow-xl rounded-2xl my-5 py-4 px-8 space-y-4">
                <h1 className="text-2xl text-center font-medium mb-5">Sign Up</h1>
                <div className="form-control">
                    <input
                        type="text"
                        placeholder="name"
                        {...register("name", { required: true })}
                        required
                        className="border border-success py-1 px-4 rounded-lg input-bordered input-success focus:outline-none lg:w-[350px] w-[300px]"
                    />
                </div>
                <div className="form-control">
                    <input
                        type="email"
                        placeholder="email"
                        {...register("email", { required: true })}
                        required
                        className="border border-success py-1 px-4 rounded-lg input-bordered input-success focus:outline-none lg:w-[350px] w-[300px]"
                    />
                </div>
                <div className="form-control  lg:w-[350px] w-[300px]">
                    <label className="label">
                        <span className="label-text">Image</span>
                    </label>
                    <input
                        type="file"
                        {...register("image", { required: true })}
                        className="w-full border py-1 px-4 rounded-lg border-success"
                    />
                </div>
                <div className="form-control w-full">
                    <input
                        type="text"
                        placeholder="phone number"
                        {...register("phone", { required: true })}
                        className="border border-success py-1 px-4 rounded-lg input-bordered input-success focus:outline-none lg:w-[350px] w-[300px]"
                    />
                </div>
                <div className="form-control relative">
                    <input
                        type={show ? "text" : "password"}
                        placeholder="password"
                        {...register("password", { required: true })}
                        required
                        className="border border-success py-1 px-4 rounded-lg input-bordered input-success focus:outline-none lg:w-[350px] w-[300px]"
                    />
                    <div onClick={() => { setShow(!show); }} className="absolute bottom-[6px] right-4 cursor-pointer text-xl hover:text-red-700">
                        {show ? <FaEye /> : <FaEyeSlash />}
                    </div>
                </div>
                <div className="form-control w-full">
                    <select
                        {...register("gender", { required: true })}
                        className="rounded-lg border py-1 px-4 border-success focus:outline-none lg:w-[350px] w-[300px]"
                    >
                        <option value="">Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                </div>
                <span className="w-full flex justify-center mt-4">
                    <small className="text-red-600">{error}</small>
                </span>
                <input
                    className="bg-[#149352] cursor-pointer text-white py-[10px] rounded-3xl mt-4 hover:bg-transparent hover:text-[#149352] hover:outline outline-[#149352] font-medium w-full"
                    type="submit"
                    value="Register"
                />
                <div className="divider">OR</div>
                <GoogleLogin />
                <span className="flex w-full justify-center mt-3">
                    <small className="text-center">
                        Already Have An Account?{" "}
                        <Link to="/login" className="text-info underline">
                            Login
                        </Link>
                    </small>
                </span>
            </form>
            <Toaster />
        </div>
    );
};

export default Register;
