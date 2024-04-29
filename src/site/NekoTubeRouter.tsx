import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./Root";
import { ErrorPage } from "./pages/ErrorPage";
import { HomePage } from "./pages/HomePage";
import { WatchPage } from "./pages/WatchPage";
import { SearchPage } from "./pages/SearchPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                errorElement: <ErrorPage />,
                children: [
                    {
                        index: true,
                        element: <HomePage />,
                    },
                    {
                        path: "watch",
                        element: <WatchPage />,
                    },
                    {
                        path: "search",
                        element: <SearchPage />,
                    },
                ],
            }
        ],
    }
]);

export const NekoTubeRouter = () => {
    return (
        <RouterProvider
            router={router}
        />
    )
};
