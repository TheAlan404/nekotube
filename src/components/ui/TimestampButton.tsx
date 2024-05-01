import { Button } from "@mantine/core";
import { secondsToTimestamp } from "../../utils/timestamp";
import { useContext } from "react";
import { VideoPlayerContext } from "../../api/context/VideoPlayerContext";

export const TimestampButton = ({
    time,
    readonly,
    isActive,
}: {
    time: number,
    readonly?: boolean,
    isActive?: boolean,
}) => {
    const { seekTo } = useContext(VideoPlayerContext);

    return (
        <Button
            variant="light"
            size="compact-sm"
            color={isActive ? "green" : "blue"}
            onClick={() => !readonly && seekTo(time)}
        >
            {secondsToTimestamp(time)}
        </Button>
    );
};
