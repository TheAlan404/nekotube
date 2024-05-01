import { Group, Loader, Stack, Text, Title } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";

export const LayoutTop = () => {
    const { playState, videoInfo } = useContext(VideoPlayerContext);

    return (
        <Stack
            p="xs"
            onClick={(e) => e.stopPropagation()}
        >
            <Group align="center" px="sm">
                {playState == "loading" && (
                    <Loader size="sm" />
                )}
                {playState == "error" && (
                    <IconAlertTriangle />
                )}
                <Stack gap={0}>
                    <Title order={4}>
                        {!videoInfo ? (
                            playState == "error" ? "Error" : "Loading..."
                        ) : (
                            videoInfo?.title || "Loading..."
                        )}
                    </Title>
                    <Text c="dimmed">
                        {playState == "error" && (
                            videoInfo ? "playback error" : "error while fetching details"
                        )}
                        {playState == "loading" && (
                            videoInfo ? "starting playback..." : "fetching video info..."
                        )}
                    </Text>
                </Stack>
            </Group>
        </Stack>
    );
};
