import { useContext, useState } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { Checkbox, Group } from "@mantine/core";

export const LoopVideo = () => {
    const { videoElement } = useContext(VideoPlayerContext);
    const [loop, setLoop] = useState(videoElement.loop);

    return (
        <Group w="100%" grow>
            <Checkbox
                label="Play on loop"
                checked={loop}
                onChange={(e) => {
                    videoElement.loop = e.currentTarget.checked;
                    setLoop(e.currentTarget.checked);
                }}
            />
        </Group>
    );
};
