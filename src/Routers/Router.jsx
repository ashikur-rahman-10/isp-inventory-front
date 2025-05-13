import { createBrowserRouter } from "react-router-dom";
import AddBook from "../Pages/AddBooks/AddBook";
import Main from "../Layouts/Main";
import Login from "../Pages/Login&Register/Login";
import Register from "../Pages/Login&Register/Register";
import AdminDashBoard from "../Pages/AdminDashBoard/AdminDashBoard";
import Books from "../Pages/Books/Books";
import ManageBook from "../Pages/ManageBook/ManageBook";
import ManageStocks from "../Pages/ManageStocks/ManageStocks";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path:'/',
        element:<AdminDashBoard/>
      },
      {
        path: "/add-book",
        element: <AddBook />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path:'/books',
        element:<Books/>
      },
      {
        path:'/manage-books',
        element:<ManageBook/>
      },
      {
        path:'/manage-stocks',
        element: <ManageStocks/>
      }
    ],
  },
]);

export default router;
