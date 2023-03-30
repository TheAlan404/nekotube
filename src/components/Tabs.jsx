import { Accordion, ActionIcon, Box, Card, Collapse, Group, Paper, ScrollArea, Text, Tooltip } from '@mantine/core'
import { openConfirmModal } from '@mantine/modals';
import { IconChevronDown, IconChevronUp, IconX } from '@tabler/icons';
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { UIContext } from '../contexts/UIContext';
import useLongPress from '../hooks/useLongPress';
import { createQuery, getQuery } from '../lib/utils';
import CommentsList from './comments/CommentsList';
import PlaylistList from './playlists/PlaylistList';
import Settings from './settings/Settings';
import ChaptersList from './videos/ChaptersList';
import RecommendedList from './videos/RecommendedList';

const Tabs = ({
    children,
    title,
}) => {
    let navigate = useNavigate();
    let [{ }, set, tabs, { remove, reorder, close }] = useContext(UIContext);

    const TabRenderers = {
        comments: () => (
            <CommentsList />
        ),
        chapters: () => (
            <ChaptersList />
        ),
        recommended: () => (
            <Box w="100%" style={{ overflowX: "hidden" }}>
                <RecommendedList />
            </Box>
        ),
        settings: () => (
            <Settings />
        ),
        playlist: () => (
            <PlaylistList />
        ),
    };

    let plCloseHandlers = useLongPress(() => {
        close("playlist");
        navigate({ search: createQuery({ v: getQuery("v") }) });
    });
    
    let plButton = (tab, i) => <Tooltip label="Hold to close playlist">
        <ActionIcon
            sx={(theme) => ({ color: theme.fn.dimmed() })}
            {...plCloseHandlers}>
            <IconX />
        </ActionIcon>
    </Tooltip>

    if (!tabs.length) return <></>;

    return (
        <>
            <Accordion variant='separated' chevronPosition="left" multiple defaultValue={["playlist", "comments", "chapters", "recommended"]}>
                {tabs.map((tab, i) => <Accordion.Item value={tab}>
                    <Box px="sm" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Accordion.Control py="sm">
                            {tab[0].toUpperCase() + tab.slice(1)}
                        </Accordion.Control>
                        <Tooltip.Group>
                            {i > 0 && <Tooltip label="Move up">
                                <ActionIcon
                                    sx={(theme) => ({ color: theme.fn.dimmed() })}
                                    onClick={() => reorder({ from: i, to: i - 1 })}>
                                    <IconChevronUp />
                                </ActionIcon>
                            </Tooltip>}
                            {(i >= (tabs.length - 1)) && i > 0 && <ActionIcon />}
                            {(i < (tabs.length - 1)) && <Tooltip label="Move down">
                                <ActionIcon
                                    sx={(theme) => ({ color: theme.fn.dimmed() })}
                                    onClick={() => reorder({ from: i, to: i + 1 })}>
                                    <IconChevronDown />
                                </ActionIcon>
                            </Tooltip>}
                            {tab == "playlist"
                                ? plButton(tab, i)
                                : (<Tooltip label="Close">
                                    <ActionIcon
                                        sx={(theme) => ({ color: theme.fn.dimmed() })}
                                        onClick={() => remove(i)}>
                                        <IconX />
                                    </ActionIcon>
                                </Tooltip>)}
                        </Tooltip.Group>
                    </Box>
                    <Accordion.Panel>
                        <ScrollArea h="65vh">
                            {TabRenderers[tab]()}
                        </ScrollArea>
                    </Accordion.Panel>
                </Accordion.Item>)}
            </Accordion>
        </>
    );
};

export default Tabs
