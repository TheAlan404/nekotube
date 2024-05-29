import { ActionIcon, Tooltip } from "@mantine/core";
import { useFullscreen } from "@mantine/hooks";
import { IconMaximize, IconMinimize, IconRepeat, IconRepeatOff } from "@tabler/icons-react";
import { useContext, useState } from "react";
import { VideoPlayerContext } from "../../../api/player/VideoPlayerContext";

export const LoopButton = () => {
    const { videoElement } = useContext(VideoPlayerContext);
    const [loop, setLoop] = useState(videoElement.loop);

    return (
        <Tooltip label={loop ? "Turn off loop" : "Click to turn on loop"}>
            <ActionIcon
                onClick={() => {
                    videoElement.loop = !videoElement.loop;
                    setLoop(!videoElement.loop);
                }}
                variant="light"
            >
                {loop ? (
                    <IconRepeatOff />
                ) : (
                    <IconRepeat />
                )}
            </ActionIcon>
        </Tooltip>
    );
};
