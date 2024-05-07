import { AppShell, Box, Button, Group } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import { IconBrandYoutube, IconCat } from "@tabler/icons-react";
import { useContext, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigation, useSearchParams } from "react-router-dom";
import { OptionsButton } from "../components/options/links/OptionsButton";
import { SearchBar } from "../components/search/SearchBar";
import { VideoPlayerContext } from "../api/player/VideoPlayerContext";
import { useDocumentTitle, useFullscreen } from "@mantine/hooks";
import { TabsContext } from "../components/tabs/TabsContext";

export const Root = () => {
    const { setVideoID, videoInfo, muted, playState } = useContext(VideoPlayerContext);
    const { isTabsVisible } = useContext(TabsContext);
    const { fullscreen } = useFullscreen();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const { state } = useNavigation();

    let isNavigating = state != "idle" || (location.pathname == "/watch" && playState == "loading");
    useEffect(() => {
        if(isNavigating) {
            nprogress.start();
        } else {
            nprogress.complete();
        }
    }, [isNavigating]);

    const v = searchParams.get("v");
    useEffect(() => {
        setVideoID(v);
    }, [v]);

    useDocumentTitle({
        "/": "Home - NekoTube",
        "/search": `🔎 ${searchParams.get("q")} - NekoTube`,
        "/watch": videoInfo ? (
            `${(playState == "paused" ? "⏸︎ " : (muted ? "🔇 " : "")) + videoInfo.title} - NekoTube`
        ) : "Loading... - NekoTube",
    }[location?.pathname] || "NekoTube");

    return (
        <AppShell
            header={{ height: "3em" }}
            padding={0}
            disabled={fullscreen && !isTabsVisible}
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Group w="100%" justify="space-between">
                        <Button
                            variant="subtle"
                            color="violet"
                            leftSection={<IconBrandYoutube />}
                            component={Link}
                            to="/"
                        >
                            NekoTube
                        </Button>
                        <Box w="30em">
                            <SearchBar />
                        </Box>
                        <OptionsButton />
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
};
