import { AppShell, Box, Button, Group } from "@mantine/core";
import { nprogress } from "@mantine/nprogress";
import { IconBrandYoutube, IconCat } from "@tabler/icons-react";
import { useContext, useEffect } from "react";
import { Link, Outlet, useNavigation, useSearchParams } from "react-router-dom";
import { OptionsButton } from "../components/options/links/OptionsButton";
import { SearchBar } from "../components/search/SearchBar";
import { VideoPlayerContext } from "../api/context/VideoPlayerContext";

export const Root = () => {
    const { setVideoID } = useContext(VideoPlayerContext);
    const [searchParams] = useSearchParams();
    const { state } = useNavigation();

    useEffect(() => {
        if(state == "idle") {
            nprogress.complete();
        } else {
            nprogress.start();
        }
    }, [state]);

    const v = searchParams.get("v");
    useEffect(() => {
        setVideoID(v);
    }, [v]);

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md"
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
