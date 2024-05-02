import { Grid, Group, Loader, Paper, ScrollArea, Stack, Text } from "@mantine/core";
import { useContext, useState } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { TimestampButton } from "../../ui/TimestampButton";
import { useVideoEventListener } from "../../../hooks/useVideoEventListener";
import { Chapter } from "../../../api/types/video";

export const ChaptersTab = () => {
    const { videoInfo, activeChapters, setActiveChapters, seekTo, videoElement } = useContext(VideoPlayerContext);
    const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);

    useVideoEventListener(videoElement, "timeupdate", () => {
        let chapter = activeChapters.chapters[activeChapters.chapters.findIndex((x) => x.time > videoElement.currentTime) - 1];
        if (currentChapter !== chapter) setCurrentChapter(chapter);
    });

    return (
        <ScrollArea w="100%" maw="100%" h="100%" offsetScrollbars>
            <Stack w="100%" p="xs">
                {videoInfo ? (
                    <Stack w="100%">
                        {activeChapters.type == "video" && (
                            <Group justify="center">
                                <Text>
                                    Showing chapters from video description
                                </Text>
                            </Group>
                        )}
                        {activeChapters.type == "comment" && (
                            "owo"
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
