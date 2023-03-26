import { Accordion, ActionIcon, Box, Card, Collapse, Group, Paper, ScrollArea, Text, Tooltip } from '@mantine/core'
import { IconX } from '@tabler/icons';
import React, { useContext } from 'react'
import { UIContext } from '../contexts/UIContext';
import CommentsList from './comments/CommentsList';

const Tabs = ({
    children,
    title,
}) => {
    let [{ commentsTabOpen }, set] = useContext(UIContext);

    return (
        <>
            <Accordion variant='separated' multiple>
                {commentsTabOpen && <Accordion.Item value='comments'>
                    <Box px="sm" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Accordion.Control py="sm">
                            Comments
                        </Accordion.Control>
                        <Tooltip label="Close">
                            <ActionIcon
                                sx={(theme) => ({ color: theme.fn.dimmed() })}
                                onClick={() => set({ commentsTabOpen: false })}>
                                <IconX />
                            </ActionIcon>
                        </Tooltip>
                    </Box>
                    <Accordion.Panel>
                        <ScrollArea h="70vh">
                            <CommentsList />
                        </ScrollArea>
                    </Accordion.Panel>
                </Accordion.Item>}
            </Accordion>
        </>
    );
};

export default Tabs
