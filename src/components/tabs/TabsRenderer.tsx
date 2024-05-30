import { Box, Loader, MantineStyleProp, Stack, Tabs, Tooltip } from "@mantine/core";
import React, { ReactNode, useContext } from "react";
import { TabsContext } from "./TabsContext";
import { TabType } from "./TabTypes";
import { RecommendedTab } from "./comps/RecommendedTab";
import { CommentsTab } from "./comps/CommentsTab";
import { VideoInfoTab } from "./comps/VideoInfoTab";
import { IconBrandYoutube, IconLayoutList, IconList, IconMessage } from "@tabler/icons-react";
import { ChaptersTab } from "./comps/ChaptersTab";
import { clamp, useHotkeys } from "@mantine/hooks";

export const TabsRenderer = ({
    isMobile,
    fullWidth,
    exclude,
    panelHeight,
    tabsListStyles,
}: {
    isMobile?: boolean;
    fullWidth?: boolean;
    exclude?: TabType[];
    panelHeight?: string;
    tabsListStyles?: MantineStyleProp;
}) => {
    const { currentTab, setCurrentTab, availableTabs } = useContext(TabsContext);

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
                
                styles={{
                    root: {
                        //height: "100%",
                        display: "flex",
                        flexDirection: "column",
                    },
                    panel: {
                        flexGrow: 1,
                        height: panelHeight,
                        width: "100%",
                    },
                }}
            >
                {Object.entries({
                    videoInfo: <VideoInfoTab />,
                    recommended: <RecommendedTab />,
                    comments: <CommentsTab />,
                    chapters: <ChaptersTab />,
                } as Record<TabType, React.ReactNode>).filter(([type]: [TabType, ReactNode]) => !(exclude || []).includes(type)).map(([type, el], i) => (
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

                <Tabs.List grow style={tabsListStyles}>
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
