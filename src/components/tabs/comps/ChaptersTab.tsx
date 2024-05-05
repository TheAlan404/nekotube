import { Accordion, ActionIcon, Button, Grid, Group, Loader, Paper, ScrollArea, Slider, Space, Stack, Text, TextInput, Tooltip, Transition } from "@mantine/core";
import { ForwardedRef, forwardRef, useContext, useEffect, useMemo, useState } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { TimestampButton } from "../../ui/TimestampButton";
import { useVideoEventListener } from "../../../hooks/useVideoEventListener";
import { Chapter } from "../../../api/types/chapter";
import { useScrollIntoObstructed } from "../../../hooks/useScrollIntoObstructed";
import { IconArrowNarrowUp, IconX } from "@tabler/icons-react";
import { randArr } from "../../../utils/math";
import { useKeyboardSfx } from "../../../hooks/useSoundEffect";
import { secondsToTimestamp } from "../../../utils/timestamp";

export const ChaptersTab = () => {
    const { videoInfo, activeChapters, setActiveChapters, seekTo, videoElement } = useContext(VideoPlayerContext);
    const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
    const [search, setSearch] = useState<string>("");
    const [group, setGroup] = useState<string | null>(null);
    const keyboardSfx = useKeyboardSfx();

    const {
        scrollIntoView,
        containerRef,
        targetRef,
        isObstructed,
    } = useScrollIntoObstructed();

    const update = () => {
        let chapter = activeChapters.chapters[activeChapters.chapters.findIndex((x) => x.time > videoElement.currentTime) - 1];
        if (currentChapter !== chapter) setCurrentChapter(chapter);
    };

    useVideoEventListener(videoElement, "timeupdate", update);
    useEffect(() => update(), []);

    const filteredChapters = activeChapters.chapters
        .filter(x => x.label.toLowerCase().includes(search.toLowerCase()));

    const allGroups = [...new Set(filteredChapters.map(c => c.group)).values()];

    const isCurrentShown = (allGroups.length == 1 ? true : (group == currentChapter?.group)) && filteredChapters.includes(currentChapter);

    const createList = (chapters: Chapter[]) => {
        return chapters.map((chapter, i) => (
            <ChapterButton
                key={i}
                ref={currentChapter == chapter ? targetRef : undefined}
                isCurrent={currentChapter == chapter}
                chapter={chapter}
            />
        ));
    };

    return (
        <ScrollArea w="100%" maw="100%" h="100%" offsetScrollbars viewportRef={containerRef}>
            <Stack w="100%">
                {videoInfo ? (
                    <Stack w="100%">
                        <ShowCurrentChapterButton
                            mounted={currentChapter && isObstructed && isCurrentShown}
                            onClick={() => {
                                setGroup(currentChapter?.group);
                                scrollIntoView({ alignment: "center" })
                            }}
                        />

                        {activeChapters.type == "video" && (
                            <Group justify="center" p="xs">
                                <Text>
                                    Showing chapters from video description
                                </Text>
                            </Group>
                        )}
                        {activeChapters.type == "comment" && (
                            <Group justify="space-between" p="xs">
                                <Text>
                                    Showing chapters from a comment
                                </Text>
                                <Tooltip label="Clear">
                                    <ActionIcon
                                        variant="light"
                                        color="violet"
                                        onClick={() => setActiveChapters("video")}
                                    >
                                        <IconX />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        )}

                        {activeChapters.chapters.length > 5 && (
                            <Paper
                                bg="dark.7"
                                shadow="md"
                                withBorder
                                p="xs"
                                pos="sticky"
                                style={{ top: "0px", zIndex: 30 }}
                            >
                                <Stack>
                                    <TextInput
                                        label="Search chapters"
                                        placeholder={"meow..."}
                                        value={search}
                                        onChange={(e) => setSearch(e.currentTarget.value)}
                                        onKeyDown={keyboardSfx}
                                        rightSection={(search && (
                                            <ActionIcon
                                                variant="light"
                                                color="gray"
                                                onClick={() => setSearch("")}
                                            >
                                                <IconX />
                                            </ActionIcon>
                                        ))}
                                    />
                                </Stack>
                            </Paper>
                        )}

                        {allGroups.length == 1 ? (
                            <Stack p="xs">
                                {createList(filteredChapters)}
                            </Stack>
                        ) : (
                            <Accordion value={group} onChange={(v) => setGroup(v)}>
                                {allGroups.map((group, i) => (
                                    <Accordion.Item
                                        key={i}
                                        value={group}
                                    >
                                        <Accordion.Control>
                                            {group}
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            <Stack p="xs">
                                                {createList(filteredChapters.filter(c => c.group == group))}
                                            </Stack>
                                        </Accordion.Panel>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        )}

                        <Space h="10em" />
                    </Stack>
                ) : (
                    <Stack w="100%" align="center">
                        <Loader />
                        <Text>
                            Loading...
                        </Text>
                    </Stack>
                )}
            </Stack>
        </ScrollArea>
    );
};

const ShowCurrentChapterButton = ({
    onClick,
    mounted,
}: {
    mounted: boolean,
    onClick: () => void,
}) => {
    return (
        <Transition
            mounted={mounted}
            transition="fade-up"
        >
            {(styles) => (
                <Stack align="center" p="sm" w="100%" style={{
                    position: "absolute",
                    bottom: "0px",
                    ...styles,
                }}>
                    <Paper
                        w="80%"
                        withBorder
                    >
                        <Button
                            onClick={onClick}
                            variant="light"
                            color="violet"
                            leftSection={<IconArrowNarrowUp />}
                            w="100%"
                        >
                            Show current chapter
                        </Button>
                    </Paper>
                </Stack>
            )}
        </Transition>
    )
}

interface ChapterButtonProps {
    chapter: Chapter;
    isCurrent?: boolean;
};

const ChapterButton = forwardRef<HTMLDivElement, ChapterButtonProps>(({
    chapter,
    isCurrent,
}, ref) => {
    const { seekTo, videoElement, activeChapters } = useContext(VideoPlayerContext);
    const [progress, setProgress] = useState(0);

    const chapterDuration = useMemo(() => {
        let currentIndex = activeChapters.chapters.indexOf(chapter);
        let nextChapter = activeChapters.chapters[currentIndex + 1];
        let endTime = nextChapter?.time || videoElement.duration;
        let chapterDuration = endTime - chapter.time;
        return chapterDuration;
    }, [chapter, isCurrent]);

    const update = () => {
        setProgress(videoElement.currentTime);
    };

    useEffect(() => {
        if (!isCurrent) return;

        videoElement.addEventListener("timeupdate", update);
        return () => videoElement.removeEventListener("timeupdate", update);
    }, [isCurrent]);

    return (
        <Paper
            p="xs"
            withBorder
            shadow="md"
            style={{ cursor: "pointer" }}
            className="hoverable"
            bg={isCurrent ? "dark.5" : undefined}
            ref={ref}
            onClick={() => seekTo(chapter.time)}
        >
            <Stack>
                <Grid>
                    <Grid.Col span="content">
                        <TimestampButton
                            time={chapter.time}
                            isActive={isCurrent}
                            readonly
                        />
                    </Grid.Col>
                    <Grid.Col span="auto">
                        <Text>
                            {chapter.label}
                        </Text>
                    </Grid.Col>
                </Grid>
                {isCurrent && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <Slider
                            min={chapter.time}
                            max={chapter.time + chapterDuration}
                            value={progress}
                            onChange={(v) => seekTo(v)}
                            label={secondsToTimestamp}
                            color="violet"
                            thumbSize={0}
                            styles={{
                                thumb: {
                                    borderColor: "unset"
                                }
                            }}
                        />
                    </div>
                )}
            </Stack>
        </Paper>
    )
});
