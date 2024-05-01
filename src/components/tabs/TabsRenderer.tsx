import { Box, Stack, Tabs } from "@mantine/core";
import { useContext } from "react";
import { TabsContext } from "./TabsContext";
import { TabType } from "./TabTypes";
import { RecommendedTab } from "./comps/RecommendedTab";
import { CommentsTab } from "./comps/CommentsTab";
import { VideoInfoTab } from "./comps/VideoInfoTab";
import { IconBrandYoutube, IconLayoutList, IconMessage } from "@tabler/icons-react";

export const TabsRenderer = () => {
    const { currentTab, setCurrentTab } = useContext(TabsContext);
    
    return (
        <Stack h="100%" w="100%">
            <Tabs
                value={currentTab}
                onChange={(v) => setCurrentTab(v as TabType)}
                inverted
                styles={{
                    root: {
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    },
                    panel: {
                        flexGrow: 1,
                        height: "calc(100vh - var(--app-shell-header-height) - calc(var(--app-shell-padding) * 2) - 3em)",
                    },
                }}
            >
                <Tabs.Panel value="videoInfo">
                    <VideoInfoTab />
                </Tabs.Panel>
                <Tabs.Panel value="recommended">
                    <RecommendedTab />
                </Tabs.Panel>
                <Tabs.Panel value="comments">
                    <CommentsTab />
                </Tabs.Panel>

                <Tabs.List grow>
                    <Tabs.Tab value="videoInfo">
                        <IconBrandYoutube />
                    </Tabs.Tab>
                    <Tabs.Tab value="recommended">
                        <IconLayoutList />
                    </Tabs.Tab>
                    <Tabs.Tab value="comments">
                        <IconMessage />
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>
        </Stack>
    );
};
