import { ActionIcon, Affix, Box, Group, ScrollArea, SegmentedControl, Stack, Text, Tooltip, rem } from '@mantine/core'
import React, { useContext, useEffect, useRef } from 'react'
import { TabsContext } from '../../contexts/TabsContext'
import TabRenderers from './TabRenderers';
import { IconBrandYoutube, IconList, IconMessage, IconPlaylist } from '@tabler/icons';
import { VideoContext } from '../../contexts/VideoContext';

const SingleTabs = () => {
    let [tabs, { setState, openOnly }] = useContext(TabsContext);
    let { playlist, chapters, descChapters } = useContext(VideoContext);

    let scrollRef = useRef();

    useEffect(() => {
        if (tabs.length > 1) {
            setState(([f]) => [f]);
        } else if (tabs.length == 0) {
            openOnly("mobileFirstTab");
        };
    }, [tabs]);

    let [tab] = tabs;

    return (
        <Box w="100%" h="100%">
            <ScrollArea ref={scrollRef} style={{
                overflowX: "hidden",
            }} w="100%" h="100%">
                {(TabRenderers[tab] || (() => ("Error:" + tab)))({ scrollRef })}
                <Box h="4em" />
            </ScrollArea>
            <Affix position={{ bottom: 0 }} w="100%">
                <SegmentedControl
                    bg="dark"
                    fullWidth
                    value={tab}
                    onChange={(t) => openOnly(t)}
                    data={[
                        {
                            value: "mobileFirstTab",
                            icon: <IconBrandYoutube />,
                            label: "Video",
                        },
                        ...(!!playlist ? [
                            {
                                value: "playlist",
                                icon: <IconPlaylist />,
                                label: "Playlist",
                            }
                        ] : []),
                        ...([chapters || [], descChapters || []].some(x => x.length) ? [
                            {
                                value: "chapters",
                                icon: <IconList />,
                                label: "Chapters",
                            }
                        ] : []),
                        {
                            value: "comments",
                            icon: <IconMessage />,
                            label: "Comments",
                        }
                    ]}
                    />
                {/* <Group >
                    {[].filter(x => x.render !== false).map(x =>
                        <Box variant="light" sx={(theme) => ({
                            ...theme.fn.focusStyles(),
                            ...theme.fn.hover(),
                        })}>
                            <Stack spacing={0} align='center' w="4em">
                                <ActionIcon
                                    onClick={() => x.onClick ? x.onClick() : }
                                    /* variant={tabs.includes(x.id) && "light"}
                                    color={tabs.includes(x.id) && "green"} 
                                    size="md">
                                    {x.icon}
                                </ActionIcon>
                                <Text>{x.label}</Text>
                            </Stack>
                        </Box>
                    )}
                </Group> */}
            </Affix>
        </Box>
    )
}

export default SingleTabs
