import { ActionIcon, Avatar, Box, Button, Collapse, CopyButton, Divider, Group, Paper, Popover, Stack, Text, Title, Tooltip, TypographyStylesProvider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBrandYoutube, IconClipboard, IconShare, IconThumbDown, IconThumbUp } from '@tabler/icons';
import { IconChevronDown } from '@tabler/icons-react';
import React, { useContext } from 'react';
import { VideoContext } from '../../contexts/VideoContext';
import useIsMobile from '../../hooks/useIsMobile';
import AlternativesButton from '../util/AlternativesButton';
import DescriptionRenderer from './DescriptionRenderer';

export default function VideoInfo({ noToggle }) {
    let video = useContext(VideoContext);
    let isMobile = useIsMobile();

    let [opened, { toggle }] = useDisclosure(true);

    return (
        <Box>
            {!opened && <Box onClick={() => toggle()}>
                <Divider label="Click to reopen info" labelPosition='center' />
            </Box>}
            <Collapse in={opened}>
                <Stack spacing="sm">
                    <Group position='apart' noWrap>
                        <Title order={3}>{video.title}</Title>
                        {isMobile && !noToggle && <ActionIcon onClick={() => toggle()}>
                            <IconChevronDown />
                        </ActionIcon>}
                    </Group>
                    <Group position='apart'>
                        <Group>
                            <Group align="center" spacing="xs">
                                <Avatar radius="xl" src={video.channel?.avatar} />
                                <Stack spacing={0}>
                                    <Text>
                                        {video.channel?.title}
                                    </Text>
                                    <Text c="dimmed">
                                        {video.channel?.subscribers}
                                    </Text>
                                </Stack>
                            </Group>
                        </Group>
                        <Group align="center">
                            <Tooltip.Group>
                                <Button.Group>
                                    <Button variant='light' color="gray" leftIcon={<IconThumbUp />}>
                                        {video.likeCount}
                                    </Button>
                                    <Button variant='light' color="gray" leftIcon={<IconThumbDown />}>
                                        {video.dislikeCount}
                                    </Button>
                                </Button.Group>

                                <Button.Group>
                                    {/* <CopyButton value={""}>
                                {({ copied, copy }) => (
                                    <Tooltip label="TODO - doesnt work (copy link)" opened={copied} events={{ focus: true, touch: true }}>
                                        <Button
                                            variant='light'
                                            color={copied ? 'teal' : 'gray'}
                                            leftIcon={<IconShare />}
                                            onClick={copy}>
                                            {isMobile ? "" : (copied ? "Copied Link!" : "Share")}
                                        </Button>
                                    </Tooltip>
                                )}
                            </CopyButton> */}
                                    <CopyButton value={video.id}>
                                        {({ copied, copy }) => (
                                            <Tooltip label={copied ? "Copied!" : "Copy video ID"} events={{ focus: true, touch: true }}>
                                                <Button
                                                    variant='light'
                                                    color={copied ? 'teal' : 'gray'}
                                                    onClick={copy}>
                                                    <IconClipboard />
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </CopyButton>
                                </Button.Group>

                                <AlternativesButton />
                            </Tooltip.Group>
                        </Group>
                    </Group>

                    <Paper p="sm" withBorder>
                        <Text fw="bold">{video.viewCount} - {video.dateText}</Text>
                        <DescriptionRenderer description={video.description} />
                    </Paper>
                </Stack>
            </Collapse>
        </Box>
    );
}
