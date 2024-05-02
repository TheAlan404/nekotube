import { Button, Grid, Group, Loader, Paper, ScrollArea, Stack, Text, Transition } from "@mantine/core";
import { useContext, useState } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { TimestampButton } from "../../ui/TimestampButton";
import { useVideoEventListener } from "../../../hooks/useVideoEventListener";
import { Chapter } from "../../../api/types/video";
import { useScrollIntoObstructed } from "../../../hooks/useScrollIntoObstructed";
import { IconArrowNarrowUp, IconX } from "@tabler/icons-react";

export const ChaptersTab = () => {
    const { videoInfo, activeChapters, setActiveChapters, seekTo, videoElement } = useContext(VideoPlayerContext);
    const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
    
    const {
        scrollIntoView,
        containerRef,
        targetRef,
        isObstructed,
    } = useScrollIntoObstructed();

    useVideoEventListener(videoElement, "timeupdate", () => {
        let chapter = activeChapters.chapters[activeChapters.chapters.findIndex((x) => x.time > videoElement.currentTime) - 1];
        if (currentChapter !== chapter) setCurrentChapter(chapter);
    });

    return (
        <ScrollArea w="100%" maw="100%" h="100%" offsetScrollbars viewportRef={containerRef}>
            <Stack w="100%" p="xs">
                {videoInfo ? (
                    <Stack w="100%">
                        <Transition
                            mounted={currentChapter && isObstructed}
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

                        {activeChapters.chapters.map((chapter, i) => (
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
                        ))}
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
