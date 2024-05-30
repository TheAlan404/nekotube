import { Box, Flex, Group, SimpleGrid, Stack } from "@mantine/core";
import { MusicPlayer } from "../../components/player/music/MusicPlayer";
import { TabsRenderer } from "../../components/tabs/TabsRenderer";
import { RecommendedTab } from "../../components/tabs/comps/RecommendedTab";
import { CommentsTab } from "../../components/tabs/comps/CommentsTab";

export const LayoutDesktopMusic = () => {
    return (
        <Flex direction="column" gap={0} h="calc(100vh - var(--app-shell-header-height))" style={{ overflow: "clip" }}>
            <Box p="sm">
                <MusicPlayer />
            </Box>
            <Group wrap="nowrap" grow>
                <RecommendedTab />
                <CommentsTab />
                <TabsRenderer
                    tabsListStyles={{} || {
                        position: "absolute",
                        bottom: "0px",
                        width: "33%",
                        backgroundColor: "var(--mantine-color-dark-filled)",
                        zIndex: "300",
                    }}
                />
            </Group>
        </Flex>
    )
};
