import { Box, Center, Group, Kbd, Stack, Text, Title, Transition } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { IconChevronDown, IconChevronRight } from '@tabler/icons';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { UIContext } from '../../contexts/UIContext';
import { VideoContext } from '../../contexts/VideoContext'
import useIsMobile from '../../hooks/useIsMobile';
import CommentsList from '../comments/CommentsList';

const WatchPageComments = () => {
    let [{}, set, tabs, tabsFn] = useContext(UIContext);
    let { commentCount } = useContext(VideoContext);
    let isMobile = useIsMobile();

    let [isFocused, setIsFocused] = useState();
    let ref = useRef();
    useHotkeys([
        ["c", () => {
            if(isFocused) tabsFn.toggle("comments");
            else ref.current?.focus();
        }],
    ]);

    if(isMobile) return <></>;

    return (
            <Stack spacing={"md"}>
                <Group position='apart'>
                    <Group ref={ref} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
                        <Title order={4}>Comments</Title>
                        <Text c="dimmed">{commentCount} comments</Text>
                    </Group>
                    {isFocused && <Text c="dimmed">
                        Press <Kbd>C</Kbd> again to toggle tab
                    </Text>}
                    <Center inline sx={(theme) => ({
                        cursor: "pointer",
                        color: theme.fn.dimmed(),
                        '&:hover': {
                            color: "white",
                        },
                    })} onClick={() => tabsFn.toggle("comments")}>
                        <Transition mounted={tabs.includes("comments")} transition="slide-right">
                            {(styles) => <Center inline style={styles}>
                                <Text>Close tab and view here</Text>
                                <IconChevronDown />
                            </Center>}
                        </Transition>
                        <Transition mounted={!tabs.includes("comments")} transition="slide-left">
                            {(styles) => <Center inline style={styles}>
                                <Text>Open as a tab</Text>
                                <IconChevronRight />
                            </Center>}
                        </Transition>
                    </Center>
                </Group>
                <Transition mounted={!tabs.includes("comments")} transition={"pop"}>
                    {(styles) => <Box style={styles}>
                        <CommentsList />
                    </Box>}
                </Transition>
            </Stack>
    )
}

export default WatchPageComments
