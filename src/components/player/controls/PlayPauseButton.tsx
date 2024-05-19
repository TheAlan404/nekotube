import { useContext, useState } from "react";
import { VideoPlayerContext } from "../../../api/player/VideoPlayerContext";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";
import { useVideoEventListener } from "../../../hooks/useVideoEventListener";
import { useIsMobile } from "../../../hooks/useIsMobile";

export const PlayPauseButton = () => {
    const isMobile = useIsMobile();
    const { videoElement, playState, togglePlay } = useContext(VideoPlayerContext);
    let playing = playState == "playing";
    //let [playing, setPlaying] = useState(!videoElement.paused);
    let disabled = playState == "loading" || playState == "error";

    //useVideoEventListener(videoElement, "play", () => setPlaying(true));
    //useVideoEventListener(videoElement, "pause", () => setPlaying(false));

    return (
        <Tooltip
            disabled={disabled}
            label={playing ? "Pause (k)" : "Play (k)"}
        >
            <ActionIcon
                onClick={() => togglePlay()}
                variant="light"
                color="violet"
            >
                {playing ? (
                    <IconPlayerPause />
                ) : (
                    <IconPlayerPlay />
                )}
            </ActionIcon>
        </Tooltip>
    );
};
