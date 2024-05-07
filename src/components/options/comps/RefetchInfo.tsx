import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/player/VideoPlayerContext";
import { Button, TextInput } from "@mantine/core";

export const RefetchInfo = () => {
    const { fetchVideoInfo } = useContext(VideoPlayerContext);

    return (
        <Button
            variant="light"
            color="violet"
            onClick={() => fetchVideoInfo()}
            fullWidth
        >
            Re-fetch video info
        </Button>
    );
};
