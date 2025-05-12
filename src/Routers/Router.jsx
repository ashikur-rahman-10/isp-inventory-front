import { createBrowserRouter } from "react-router-dom";
import AddBook from "../Pages/AddBooks/AddBook";
import Main from "../Layouts/Main";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
       children:[
        {
            path:'/add-book',
            element:<AddBook/>
        }
       ]
    }
]);

export default router;
