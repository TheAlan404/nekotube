import { Box, Stack, Tabs, Tooltip } from "@mantine/core";
import React, { useContext } from "react";
import { TabsContext } from "./TabsContext";
import { TabType } from "./TabTypes";
import { RecommendedTab } from "./comps/RecommendedTab";
import { CommentsTab } from "./comps/CommentsTab";
import { VideoInfoTab } from "./comps/VideoInfoTab";
import { IconBrandYoutube, IconLayoutList, IconList, IconMessage } from "@tabler/icons-react";
import { ChaptersTab } from "./comps/ChaptersTab";

export const TabsRenderer = () => {
    const { currentTab, setCurrentTab } = useContext(TabsContext);

    const height = `calc(100vh - var(--app-shell-header-height) - calc(var(--app-shell-padding) * 2) - 3em)`;
    
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
                        height,
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
                <Tabs.Panel value="chapters">
                    <ChaptersTab />
                </Tabs.Panel>

                <Tabs.List grow>
                    <Tooltip.Group>
                        {([
                            {
                                value: "videoInfo",
                                title: "Video Info",
                                icon: <IconBrandYoutube />,
                            },
                            {
                                value: "recommended",
                                title: "Recommended",
                                icon: <IconLayoutList />,
                            },
                            {
                                value: "comments",
                                title: "Comments",
                                icon: <IconMessage />,
                            },
                            {
                                value: "chapters",
                                title: "Chapters",
                                icon: <IconList />,
                            },
                        ] as {
                            value: string;
                            title: string;
                            icon: React.ReactNode;
                            hidden?: boolean;
                        }[]).filter(x => !x.hidden).map(({
                            title,
                            value,
                            icon,
                        }, i) => (
                            <Tooltip label={title} withArrow>
                                <Tabs.Tab value={value}>
                                    {icon}
                                </Tabs.Tab>
                            </Tooltip>
                        ))}
                    </Tooltip.Group>
                </Tabs.List>
            </Tabs>
        </Stack>
    );
};
