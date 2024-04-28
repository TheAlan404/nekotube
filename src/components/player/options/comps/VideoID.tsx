import { useContext } from "react";
import { VideoPlayerContext } from "../../../../api/context/VideoPlayerContext";
import { TextInput } from "@mantine/core";

export const VideoID = () => {
    const { videoID, setVideoID } = useContext(VideoPlayerContext);

    return (
        <TextInput
            w="100%"
            label="Video ID"
            description="here for debugging purposes"
            value={videoID}
            onChange={(e) => setVideoID(e.currentTarget.value)}
        />
    );
};
