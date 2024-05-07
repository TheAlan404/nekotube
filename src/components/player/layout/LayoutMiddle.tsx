import { Box, Loader, Stack } from "@mantine/core";
import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/player/VideoPlayerContext";
import { ErrorMessage } from "../../ui/ErrorMessage";

export const LayoutMiddle = () => {
    const { playState, videoInfo, videoElement, fetchVideoInfo, error } = useContext(VideoPlayerContext);

    return (
        <Stack w="100%" align="center">
            {playState == "loading" && (
                <Box p="md" bg="dark" style={{ opacity: 0.9, borderRadius: "var(--mantine-radius-md)" }}>
                    <Loader />
                </Box>
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
