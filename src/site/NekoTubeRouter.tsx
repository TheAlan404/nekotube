import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./Root";
import { ErrorPage } from "./pages/ErrorPage";
import { HomePage } from "./pages/HomePage";
import { WatchPage } from "./pages/WatchPage";
import { SearchPage } from "./pages/SearchPage";
import { APIControllerProvider } from "../api/provider/APIController";
import { PreferencesProvider } from "../api/pref/Preferences";
import { VideoPlayerProvider } from "../api/player/VideoPlayerProvider";
import { OptionsProvider } from "../components/options/OptionsContext";
import { TabsProvider } from "../components/tabs/TabsContext";

const ContextStack = () => {
    return (
        <APIControllerProvider>
            <PreferencesProvider>
                <VideoPlayerProvider>
                    <OptionsProvider>
                        <TabsProvider>
                            <Root />
                        </TabsProvider>
                    </OptionsProvider>
                </VideoPlayerProvider>
            </PreferencesProvider>
        </APIControllerProvider>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <ContextStack />,
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
