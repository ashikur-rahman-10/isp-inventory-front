import React, { createContext, useEffect, useState } from "react";
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import app from "../Firebase/Firebase.init";
import axios from "axios";

export const AuthContext = createContext();
const AuthProviders = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const auth = getAuth(app);

    const googleProvider = new GoogleAuthProvider();

    // Create User
    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Sign In an user with Password
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Sign In an user with Google
    const loginWithGoogle = () => {
        return signInWithPopup(auth, googleProvider);
    };
    // Logout User
    const logout = () => {
        return signOut(auth);
    };

    // UpdateUserProfile
    const updateUser = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo,
        });
    };

    const verification = (user) => {
        if (user) {
            return sendEmailVerification(user);
        } else {
            return Promise.reject(new Error("User is not authenticated."));
        }
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    // use onauthState change
    useEffect(() => {
        // const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        //     setUser(currentUser);
        //     setLoading(false);
        // });

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                axios
                    .post("https://bornomala-boighor-server.vercel.app/jwt", {
                        email: currentUser.email,
                    })
                    .then((data) => {
                        if (data.data) {
                            localStorage.setItem(
                                "access-token",
                                data.data.token
                            );
                        }
                    });
            } else {
                localStorage.removeItem("access-token");
            }
            setLoading(false);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const authInfo = {
        user,
        createUser,
        updateUser,
        login,
        loginWithGoogle,
        logout,
        loading,
        verification,
        resetPassword
    };
    return (
        <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    );
};

export default AuthProviders;
