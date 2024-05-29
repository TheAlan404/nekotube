import { Box, Stack } from "@mantine/core";
import { MusicPlayer } from "../../components/player/music/MusicPlayer";
import { TabsRenderer } from "../../components/tabs/TabsRenderer";

export const LayoutDesktopMusic = () => {
    return (
        <Stack gap={0} h="calc(100vh - var(--app-shell-header-height))" style={{ overflow: "clip" }}>
            <Box p="sm">
                <MusicPlayer />
            </Box>
            <TabsRenderer isMobile />
        </Stack>
    )
};
