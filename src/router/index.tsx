import { createBrowserRouter } from "react-router-dom";
import AppLayout from "@/layout/Layout";
import Home from "@/pages/home/Home";
import Category from "@/pages/category/Category";
import CreateContent from "@/pages/content/create/CreateContent";
import ViewContent from "@/pages/content/view/ViewContent";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/category", element: <Category /> },
      { path: "/content/edit/:id", element: <CreateContent /> },
      { path: "/content/create", element: <CreateContent /> },
      { path: "/content/view", element: <ViewContent /> },
    ],
  },
]);

export default routers;
