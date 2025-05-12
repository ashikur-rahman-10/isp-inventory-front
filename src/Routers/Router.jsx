import { createBrowserRouter } from "react-router-dom";
import AddBook from "../Pages/AddBooks/AddBook";
import Main from "../Layouts/Main";
import Login from "../Pages/Login&Register/Login";
import Register from "../Pages/Login&Register/Register";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
       children:[
        {
            path:'/add-book',
            element:<AddBook/>
        },
        {
            path:"/login",
            element:<Login/>
        },
        {
            path:"/register",
            element:<Register/>
        }
       ]
    }
]);

export default router;
