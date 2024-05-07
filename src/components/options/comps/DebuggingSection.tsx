import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/player/VideoPlayerContext";
import { Button, CopyButton, Stack, TextInput } from "@mantine/core";

export const DebuggingSection = () => {
    const { fetchVideoInfo, videoID } = useContext(VideoPlayerContext);

    return (
        <Stack w="100%">
            <CopyButton value={videoID}>
                {({ copied, copy }) => (
                    <Button
                        variant="light"
                        color={copied ? "green" : "violet"}
                        onClick={() => copy()}
                        fullWidth
                    >
                        {copied ? "Copied!" : "Copy video ID"}
                    </Button>
                )}
            </CopyButton>
            <Button
                variant="light"
                color="violet"
                onClick={() => fetchVideoInfo()}
                fullWidth
            >
                Re-fetch video info
            </Button>
        </Stack>
    );
};
