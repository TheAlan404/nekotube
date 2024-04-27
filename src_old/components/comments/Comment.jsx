import { ActionIcon, Avatar, Collapse, Grid, Group, Paper, Stack, Text, Tooltip, TypographyStylesProvider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { IconPinned, IconTableImport, IconThumbUp } from '@tabler/icons';
import React, { useContext } from 'react'
import { UIContext } from '../../contexts/UIContext';
import { VideoContext } from '../../contexts/VideoContext';
import useFormatter from '../../hooks/useFormatter';
import useOverflow from '../../hooks/useOverflow'
import { parseChapters, timestampRegex } from '../../lib/utils';

const Comment = (props) => {
    let { setChapters } = useContext(VideoContext);
    let [{ chapterProviderComment }, set] = useContext(UIContext);
    let { ref, overflown } = useOverflow([ props.content ]);
    let [opened, { close, open }] = useDisclosure();
    let format = useFormatter();

    let content = <Text>
        {/* <div dangerouslySetInnerHTML={{ __html: props.content }} /> */}
        {format(props.content)}
    </Text>;

    return (
        <>
            <Paper p="sm" withBorder>
                <Grid columns={2} align="flex-start">
                    <Grid.Col span="content">
                        <Avatar size="md" radius="xl" src={props.owner?.avatar} imageProps={{ loading: "lazy" }} />
                    </Grid.Col>
                    <Grid.Col span="auto">
                        <Stack spacing={0}>
                            <Group position='apart'>
                                <Group>
                                    <Text fw="bold">
                                        {props.owner?.title}
                                    </Text>
                                    <Text c="dimmed">
                                        {props.publishedTimeText}
                                    </Text>
                                </Group>
                                {props.pinned && <Group spacing="xs" c="dimmed">
                                    <IconPinned size="1em" />
                                    <Text>Pinned</Text>
                                </Group>}
                                {/* ... */}
                            </Group>
                            <div>
                                {overflown && <Collapse in={opened}>
                                    {content}
                                    <Text style={{ cursor: "pointer" }} mt="md" underline c="dimmed" onClick={close}>
                                        Show less
                                    </Text>
                                </Collapse>}
                                {(!opened && <>
                                    <Text lineClamp={4} ref={ref}>
                                        {content}
                                    </Text>
                                    {overflown && <Text fz="sm" mt="md" underline c="dimmed" style={{ cursor: "pointer" }} onClick={open}>Show more</Text>}
                                </>)}
                            </div>
                            <Group mt="sm">
                                <Group spacing="xs">
                                    <IconThumbUp size="1em" />
                                    {props.likeCount}
                                </Group>
                                {timestampRegex.test(props.content) &&
                                <Tooltip label={chapterProviderComment == props.id ? "Stop using as chapter list" : "Use as chapter list"}>
                                    <ActionIcon
                                        color={chapterProviderComment == props.id && "green"}
                                        variant={chapterProviderComment == props.id && "light"}
                                        onClick={() => {
                                            if(chapterProviderComment == props.id) {
                                                setChapters([]);
                                                set({ chapterProviderComment: null });
                                            } else {
                                                setChapters(parseChapters(props.content));
                                                set({ chapterProviderComment: props.id });
                                            };
                                        }}>
                                        <IconTableImport />
                                    </ActionIcon>
                                </Tooltip>}
                            </Group>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Paper>
        </>
    )
}

export default Comment
