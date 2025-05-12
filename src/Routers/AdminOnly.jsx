import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "../Hooks/UseAuth";
import UseAdmin from "../Hooks/UseAdmin";
import CustomLoader from "../Components/CustomLoader/CustomLoader";

const AdminOnly = ({ children }) => {
    const { user, loading } = useAuth();
    const { admin, adminLoading } = UseAdmin();

    useEffect(() => {
        if (!admin && !user && !loading) {
            <Navigate to="/login" />;
        }
    }, [user, admin, loading]);

    if (adminLoading) {
        return <CustomLoader />;
    }
    if (!admin && user) {
        return <div className="w-full h-[80vh] flex-col text-red-500 text-3xl font-bold uppercase font-mono flex items-center justify-center">
          Entry Restricted <br />
          <span className="text-xl">authorised person only</span>
        </div>;
    }
    if (!user) {
        return <div className="w-full h-screen flex items-center justify-center">Please Login to continue</div>;
    }
    
    return children;
};

export default AdminOnly;
