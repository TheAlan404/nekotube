import { ActionIcon, Button, Grid, Group, Loader, Paper, ScrollArea, Space, Stack, Text, TextInput, Transition } from "@mantine/core";
import { useContext, useEffect, useMemo, useState } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { TimestampButton } from "../../ui/TimestampButton";
import { useVideoEventListener } from "../../../hooks/useVideoEventListener";
import { Chapter } from "../../../api/types/video";
import { useScrollIntoObstructed } from "../../../hooks/useScrollIntoObstructed";
import { IconArrowNarrowUp, IconX } from "@tabler/icons-react";
import { randArr } from "../../../utils/math";
import { useKeyboardSfx } from "../../../hooks/useSoundEffect";

export const ChaptersTab = () => {
    const { videoInfo, activeChapters, setActiveChapters, seekTo, videoElement } = useContext(VideoPlayerContext);
    const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
    const [search, setSearch] = useState<string>("");
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

    const isCurrentShown = filteredChapters.includes(currentChapter);

    const list = useMemo(() => {
        return filteredChapters.map((chapter, i) => (
            <Paper
                key={i}
                p="xs"
                withBorder
                shadow="md"
                style={{ cursor: "pointer" }}
                className="hoverable"
                bg={currentChapter == chapter ? "dark.5" : undefined}
                ref={currentChapter == chapter ? targetRef : undefined}
                onClick={() => seekTo(chapter.time)}
            >
                <Grid>
                    <Grid.Col span="content">
                        <TimestampButton
                            time={chapter.time}
                            isActive={currentChapter == chapter}
                            readonly
                        />
                    </Grid.Col>
                    <Grid.Col span="auto">
                        <Text>
                            {chapter.label}
                        </Text>
                    </Grid.Col>
                </Grid>
            </Paper>
        ));
    }, [filteredChapters, currentChapter]);

    return (
        <ScrollArea w="100%" maw="100%" h="100%" offsetScrollbars viewportRef={containerRef}>
            <Stack w="100%" p="xs">
                {videoInfo ? (
                    <Stack w="100%">
                        <Transition
                            mounted={currentChapter && isObstructed && isCurrentShown}
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
                                            onClick={() => scrollIntoView({ alignment: "center" })}
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
                        {activeChapters.type == "video" && (
                            <Group justify="center">
                                <Text>
                                    Showing chapters from video description
                                </Text>
                            </Group>
                        )}
                        {activeChapters.type == "comment" && (
                            <Group justify="space-between">
                                <Text>
                                    Showing chapters from a comment
                                </Text>
                                <Button
                                    variant="light"
                                    color="violet"
                                    onClick={() => setActiveChapters("video")}
                                    leftSection={<IconX />}
                                >
                                    Clear
                                </Button>
                            </Group>
                        )}

                        {activeChapters.chapters.length > 5 && (
                            <TextInput
                                label="Search chapters"
                                placeholder={randArr(activeChapters.chapters).label + "..."}
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
                        )}

                        {list}
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
