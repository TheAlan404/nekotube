import { Box, Loader, Stack, Tabs, Tooltip } from "@mantine/core";
import React, { useContext } from "react";
import { TabsContext } from "./TabsContext";
import { TabType } from "./TabTypes";
import { RecommendedTab } from "./comps/RecommendedTab";
import { CommentsTab } from "./comps/CommentsTab";
import { VideoInfoTab } from "./comps/VideoInfoTab";
import { IconBrandYoutube, IconLayoutList, IconList, IconMessage } from "@tabler/icons-react";
import { ChaptersTab } from "./comps/ChaptersTab";
import { clamp, useHotkeys } from "@mantine/hooks";

export const TabsRenderer = () => {
    const { currentTab, setCurrentTab, availableTabs } = useContext(TabsContext);

    const height = `calc(100vh - var(--app-shell-header-height) - calc(var(--app-shell-padding) * 2) - 3em)`;

    useHotkeys([
        ["z", () => setCurrentTab(availableTabs[availableTabs.indexOf(currentTab) - 1] || availableTabs[availableTabs.length - 1])],
        ["x", () => setCurrentTab(availableTabs[availableTabs.indexOf(currentTab) + 1] || availableTabs[0])],
    ]);

    return (
        <Stack h="100%" w="100%">
            <Tabs
                value={currentTab}
                onChange={(v) => setCurrentTab(v as TabType)}
                keepMounted={true}
                inverted
                color="violet"
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
                {Object.entries({
                    videoInfo: <VideoInfoTab />,
                    recommended: <RecommendedTab />,
                    comments: <CommentsTab />,
                    chapters: <ChaptersTab />,
                } as Record<TabType, React.ReactNode>).map(([type, el], i) => (
                    <Tabs.Panel
                        value={type}
                        key={i}
                    >
                        <React.Suspense
                            fallback={<Loader />}
                        >
                            {el}
                        </React.Suspense>
                    </Tabs.Panel>
                ))}

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
                            value: TabType;
                            title: string;
                            icon: React.ReactNode;
                        }[]).filter(x => availableTabs.includes(x.value)).map(({
                            title,
                            value,
                            icon,
                        }, i) => (
                            <Tooltip label={title} withArrow key={i}>
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
