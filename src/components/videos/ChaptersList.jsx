import { Button, Center, Group, Paper, Stack, Text } from '@mantine/core';
import React, { useContext } from 'react'
import { UIContext } from '../../contexts/UIContext';
import { VideoContext } from '../../contexts/VideoContext';
import Timestamp from '../buttons/Timestamp';

const ChaptersList = () => {
    let {
        setChapters,
        descChapters,
        chapters,
    } = useContext(VideoContext);
    let [{ currentChapter, chapterProviderComment }, set] = useContext(UIContext);

    let li = ([(chapters || []), (descChapters || [])].find(x => x.length) || []);

    return (
        <>
            <Stack>
                {chapters && !!chapters.length && <Stack align="center">
                    <Text>Using chapters from a comment.</Text>
                    <Button color="gray" onClick={() => {
                        setChapters([]);
                        set({ chapterProviderComment: null });
                    }} compact>Click to clear</Button>
                </Stack>}
                {!li.length && <Center>
                    <Text>
                        No chapters...
                    </Text>
                </Center>}
                {li.map((chapter, i) => (<Paper withBorder p="sm" shadow="md" sx={(theme) => ({
                    ...theme.fn.hover(),
                    backgroundColor:
                        currentChapter && currentChapter.i == i && (theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]),
                    cursor: "pointer",
                    '&:hover': {
                        backgroundColor:
                            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                    },
                })} onClick={() => set({ jumpTo: chapter.time })}>
                    <Group position='apart'>
                        <Group>
                            <Timestamp time={chapter.time} noFunction color={currentChapter && currentChapter.i == i && "green"} />
                            <Text>
                                {chapter.name}
                            </Text>
                        </Group>
                    </Group>
                </Paper>))}
            </Stack>
        </>
    )
}

export default ChaptersList
