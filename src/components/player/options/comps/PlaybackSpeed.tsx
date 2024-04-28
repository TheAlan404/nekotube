import { useContext, useState } from "react";
import { VideoPlayerContext } from "../../../../api/context/VideoPlayerContext";
import { Grid, Group, Slider, Stack, Text } from "@mantine/core";

export const PlaybackSpeed = () => {
    const { videoElement } = useContext(VideoPlayerContext);
    const [playbackSpeed, setPlaybackSpeed] = useState(videoElement.playbackRate);

    return (
        <Stack w="100%">
            <Text>
                Playback Rate
            </Text>
            <Grid>
                <Grid.Col span="auto">
                    <Slider
                        value={playbackSpeed}
                        onChange={(v) => {
                            videoElement.playbackRate = v;
                            setPlaybackSpeed(v);
                        }}
                        label={(v) => v+"x"}
                        min={0}
                        max={2}
                        step={0.05}
                        marks={[
                            { value: 1, label: "1" },
                        ]}
                    />
                </Grid.Col>
                <Grid.Col span="content">

                </Grid.Col>
            </Grid>
        </Stack>
    );
};
