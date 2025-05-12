import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hooks/UseAuth";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    const location = useLocation();

    if (loading) {
        return <div>Loading</div>
    }
    if (user) {
        return children;
    }
    return <Navigate to={"/login"} replace state={location}></Navigate>;
};

export default PrivateRoute;
