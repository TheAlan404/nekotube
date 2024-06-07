import { ActionIcon, AppShell, Box, Button, Group } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import { IconBrandYoutube, IconCat } from "@tabler/icons-react";
import { useContext, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigation, useSearchParams } from "react-router-dom";
import { OptionsButton } from "../components/options/links/OptionsButton";
import { SearchBar } from "../components/search/SearchBar";
import { VideoPlayerContext } from "../api/player/VideoPlayerContext";
import { useDocumentTitle, useFullscreen } from "@mantine/hooks";
import { TabsContext } from "../components/tabs/TabsContext";
import { useNekoTubeHistory } from "../api/pref/History";

export const Root = () => {
    const { setVideoID, videoInfo, muted, playState } = useContext(VideoPlayerContext);
    const { isTabsVisible } = useContext(TabsContext);
    const { fullscreen } = useFullscreen();
    const [searchParams] = useSearchParams();
    const history = useNekoTubeHistory();
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

    useDocumentTitle({
        "/": "Home | NekoTube",
        "/search": `🔎 ${searchParams.get("q")} | NekoTube`,
        "/watch": videoInfo ? (
            `${(playState == "paused" ? "⏸︎ " : (muted ? "🔇 " : "")) + videoInfo.title} | NekoTube`
        ) : "Loading... | NekoTube",
    }[location?.pathname] || "NekoTube");

    useEffect(() => {
        console.log("changed")
        if(location.pathname == "/search") history.add(["s", searchParams.get("q")]);
        if(location.pathname == "/watch") {
            history.add(["v", searchParams.get("v")]);
            setVideoID(searchParams.get("v"));
        }
    }, [location.pathname, location.search]);

    return (
        <AppShell
            header={{ height: "3em" }}
            padding={0}
            disabled={!isTabsVisible}
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Group w="100%" justify="space-between" wrap="nowrap">
                        <Button
                            visibleFrom="md"
                            variant="subtle"
                            
                            leftSection={<IconBrandYoutube />}
                            component={Link}
                            to="/"
                        >
                            NekoTube
                        </Button>

                        <ActionIcon
                            hiddenFrom="md"
                            variant="subtle"
                            
                            component={Link}
                            to="/"
                        >
                            <IconBrandYoutube />
                        </ActionIcon>

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
