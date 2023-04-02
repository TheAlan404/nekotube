import { ActionIcon, Box, Group, Stack, Switch, Text, Title, Tooltip, Transition } from '@mantine/core'
import { IconLayout, IconList, IconMessage, IconPlaylist } from '@tabler/icons-react';
import React, { useContext } from 'react'
import { SettingsContext } from '../../contexts/SettingsContext';
import { UIContext } from '../../contexts/UIContext';
import { VideoContext } from '../../contexts/VideoContext';
import useIsMobile from '../../hooks/useIsMobile';
import Tabs from '../Tabs'
import RecommendedList from '../videos/RecommendedList';


function TabButtons() {
    let [{ }, set, tabs, tabsFn] = useContext(UIContext);
    let { playlist, chapters, descChapters } = useContext(VideoContext);
    let [{ ux_tabButtons }] = useContext(SettingsContext);

    if(!ux_tabButtons) return <></>;

    return (<Group position='right'>
        {[{
            id: "playlist",
            icon: <IconPlaylist />,
            render: !!playlist
        }, {
            id: "chapters",
            icon: <IconList />,
            render: [chapters || [], descChapters || []].some(x => x.length)
        }, {
            id: "comments",
            icon: <IconMessage />
        }, {
            id: "recommended",
            icon: <IconLayout />
        }].filter(x => x.render !== false).map(x => <Tooltip label={"Toggle tab for " + x.id[0].toUpperCase() + x.id.slice(1)}>
            <ActionIcon
                onClick={() => x.onClick ? x.onClick() : tabsFn.toggle(x.id)}
                variant={tabs.includes(x.id) && "light"}
                color={tabs.includes(x.id) && "green"}>
                {x.icon}
            </ActionIcon>
        </Tooltip>)}
    </Group>);
}


const WatchPageRightside = ({ isLoading }) => {
    let [{ }, set, tabs, tabsFn] = useContext(UIContext);
    let [{ autoplay }] = useContext(SettingsContext);
    let isMobile = useIsMobile();

    return (
        <Stack spacing={0}>
            <TabButtons />
            <Tabs />
            {!isMobile && <>
                <Group position='apart' mb="md">
                    <Title order={4}>Recommended</Title>
                    <Switch
                        checked={!!autoplay}
                        onChange={(event) => set({
                            autoplay: event.currentTarget.checked,
                        })}
                        label="Autoplay"
                        />
                    <Text sx={(theme) => ({
                        color: theme.fn.dimmed(),
                        cursor: "pointer",
                        '&:hover': {
                            color: "white",
                        },
                    })} onClick={() => {
                        tabs.includes("recommended") ? tabsFn.filter(x => x != "recommended") : tabsFn.prepend("recommended")
                    }}>{tabs.includes("recommended") ? "Close tab" : "Open tab"}</Text>
                </Group>
                <Transition mounted={!isLoading} transition={"slide-left"}>
                    {(styles) =>
                        <Box style={{
                            ...styles,
                            overflowX: "hidden",
                            overflowY: "hidden",
                        }} w="100%">
                            {!tabs.includes("recommended") && <RecommendedList />}
                        </Box>
                    }
                </Transition>
            </>}
        </Stack>
    )
}

export default WatchPageRightside
