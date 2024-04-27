import { useContext, useState } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { useVideoEventListener } from "../../../hooks/useVideoEventListener";
import { CopyButton, Group, Text, Tooltip } from "@mantine/core";
import { secondsToTimestamp } from "../../../utils/timestamp";

export const PlayerTimestamp = () => {
    const { videoElement } = useContext(VideoPlayerContext);
    const [progress, setProgress] = useState(0);

    useVideoEventListener(videoElement, "timeupdate", () => {
        setProgress(videoElement.currentTime);
    });

    const progressText = secondsToTimestamp(progress);

    return (
        <Group>
            <CopyButton value={progressText}>
                {({ copied, copy }) => (
                    <Tooltip
                        label={copied ? "Copied!" : "Click to copy"}
                    >
                        <Text onClick={() => copy()} span>
                            {progressText}
                        </Text>
                    </Tooltip>
                )}
            </CopyButton>
            <Text span>
                /
            </Text>
            <Text span>
                {secondsToTimestamp(videoElement.duration || 0)}
            </Text>
        </Group>
    );
};
