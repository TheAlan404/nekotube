import { Affix, Button, Center, Group, Paper, Stack, Text, Transition } from '@mantine/core';
import { useIntersection, useMergedRef, useScrollIntoView } from '@mantine/hooks';
import { IconArrowUp } from '@tabler/icons-react';
import React, { useContext, useEffect, useRef } from 'react'
import { UIContext } from '../../contexts/UIContext';
import { VideoContext } from '../../contexts/VideoContext';
import Timestamp from '../buttons/Timestamp';

const ChaptersList = ({ scrollRef }) => {
    let {
        setChapters,
        descChapters,
        chapters,
    } = useContext(VideoContext);
    let [{ currentChapter, chapterProviderComment }, set] = useContext(UIContext);

    let li = ([(chapters || []), (descChapters || [])].find(x => x.length) || []);

    // affix stuff

    let { ref: intersecRef, entry } = useIntersection({
        root: scrollRef.current,
        threshold: 1,
    });

    const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView({
        offset: 60,
    });

    useEffect(() => {
        scrollableRef.current = scrollRef.current;
    }, [scrollRef.current]);

    let ref = useMergedRef(targetRef, intersecRef);

    let flag_affix = false;

    // render

    return (
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
                wordBreak: "normal",
            })} onClick={() => set({ jumpTo: chapter.time })}
                ref={(currentChapter && currentChapter.i == i) ? ref : undefined}>
                <Group position='apart'>
                    <Group noWrap>
                        <Timestamp time={chapter.time} noFunction color={currentChapter && currentChapter.i == i && "green"} />
                        <Text style={{ overflowWrap: "break-word" }}>
                            {chapter.name}
                        </Text>
                    </Group>
                </Group>
            </Paper>))}

            {flag_affix && <Affix position={{ bottom: "20", right: "50%", }} withinPortal={false} target={<div></div>}>
                <Transition transition="slide-up" mounted={!entry?.isIntersecting}>
                    {(transitionStyles) => (
                        <Button
                            leftIcon={<IconArrowUp size="1rem" />}
                            style={transitionStyles}
                            onClick={() => scrollIntoView()}>
                            go to current chapter
                        </Button>
                    )}
                </Transition>
            </Affix>}
        </Stack>
    )
}

export default ChaptersList
