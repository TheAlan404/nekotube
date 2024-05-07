import { Box, Button, Grid, Group, Loader, Paper, Progress, Stack, Text } from "@mantine/core";
import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/player/VideoPlayerContext";
import { ErrorMessage } from "../../ui/ErrorMessage";
import Countdown from "react-countdown";
import { HorizontalVideoCard } from "../../cards/VideoCard";

export const LayoutMiddle = () => {
    const {
        playState,
        videoInfo,
        videoElement,
        fetchVideoInfo,
        error,
        autoplayDate,
        cancelAutoplay,
    } = useContext(VideoPlayerContext);

    // #MARKER

    return (
        <Stack w="100%" align="center" onClick={(e) => e.stopPropagation()}>
            {playState == "loading" && (
                <Box p="md" bg="dark" style={{ opacity: 0.9, borderRadius: "var(--mantine-radius-md)" }}>
                    <Loader />
                </Box>
            )}

            {autoplayDate && (
                <Paper
                    p="lg"
                    withBorder
                    shadow="md"
                    radius="md"
                >
                    <Stack>
                        <Text>
                            Up next:
                        </Text>
                        <HorizontalVideoCard
                            video={videoInfo.recommended[0]}
                        />
                        <Grid align="end">
                            <Grid.Col span="content">
                                <Button
                                    variant="light"
                                    color="violet"
                                    onClick={() => cancelAutoplay()}
                                >
                                    Cancel
                                </Button>
                            </Grid.Col>
                            <Grid.Col span="auto">
                                <Countdown
                                    date={autoplayDate}
                                    renderer={({ seconds, milliseconds }) => (
                                        <Stack w="100%" align="end">
                                            <Text>
                                                {seconds}s
                                            </Text>
                                            <Progress
                                                w="100%"
                                                value={100 - (
                                                    (seconds) / 10
                                                ) * 100}
                                                transitionDuration={1000}
                                            />
                                        </Stack>
                                    )}
                                />
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Paper>
            )}

            {playState == "error" && (
                <Stack w="100%" bg="dark" py="md">
                    <ErrorMessage
                        error={error}
                        retry={videoInfo ? (() => {
                            let t = videoElement.currentTime;
                            videoElement.load();
                            videoElement.play();
                            videoElement.currentTime = t;
                        }) : fetchVideoInfo}
                    />
                </Stack>
            )}
        </Stack>
    );
};
