import { Grid, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/player/VideoPlayerContext";
import { useIsMobile } from "../../../hooks/useIsMobile";

export const PlayerLayoutTop = () => {
    const { playState, videoInfo } = useContext(VideoPlayerContext);
    const isMobile = useIsMobile();

    return (
        <Stack
            p="xs"
            onClick={(e) => e.stopPropagation()}
        >
            <Grid align="center">
                <Grid.Col span="content">
                    {playState == "loading" && (
                        <Loader size="sm" />
                    )}
                    {playState == "error" && (
                        <IconAlertTriangle />
                    )}
                </Grid.Col>
                <Grid.Col span="auto">
                    <Stack gap={0}>
                        <Title order={isMobile ? 6 : 4}>
                            {!videoInfo ? (
                                playState == "error" ? "Error" : "Loading..."
                            ) : (
                                videoInfo?.title || "Loading..."
                            )}
                        </Title>
                        <Text c="dimmed" fz={isMobile ? "xs" : undefined}>
                            {playState == "error" && (
                                videoInfo ? "playback error" : "error while fetching details"
                            )}
                            {playState == "loading" && (
                                videoInfo ? "starting playback..." : "fetching video info..."
                            )}
                            {playState !== "error" && playState !== "loading" && (
                                videoInfo?.channel?.title
                            )}
                        </Text>
                    </Stack>
                </Grid.Col>
            </Grid>


        </Stack>
    );
};
