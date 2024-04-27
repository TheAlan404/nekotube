import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";

export const PlayPauseButton = () => {
    const { playState, togglePlay } = useContext(VideoPlayerContext);

    return (
        <Tooltip
            disabled={playState == "loading"}
            label={playState == "playing" ? "Pause" : "Play"}
        >
            <ActionIcon
                onClick={() => togglePlay()}
                variant="light"
                color="violet"
            >
                {playState == "playing" ? (
                    <IconPlayerPause />
                ) : (
                    <IconPlayerPlay />
                )}
            </ActionIcon>
        </Tooltip>
    );
};
