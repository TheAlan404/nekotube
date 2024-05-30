import { Group, Paper, Stack } from "@mantine/core"
import { PlayPauseButton } from "../controls/PlayPauseButton"
import { VolumeControls } from "../controls/VolumeControls"
import { PlayerTimestamp } from "../controls/PlayerTimestamp"
import { ProgressBar } from "../bar/ProgressBar"
import { LoopButton } from "../controls/LoopButton"
import { PlayerLayoutTop } from "../layout/LayoutTop"
import { useContext } from "react"
import { VideoPlayerContext } from "../../../api/player/VideoPlayerContext"
import { ErrorMessage } from "../../ui/ErrorMessage"

export const MusicControls = () => {
    const { error, playState, videoInfo, fetchVideoInfo, videoElement } = useContext(VideoPlayerContext);

    return (
        <Paper withBorder p="sm" bg="dark">
            <Stack>
                {playState == "error" ? (
                    <Stack w="100%" bg="dark" py="md">
                        <ErrorMessage
                            error={error}
                            retry={videoInfo ? (() => {
                                let t = videoElement.currentTime;
                                videoElement.load();
                                videoElement.play();
                                videoElement.currentTime = t;
                            }) : fetchVideoInfo}
                        />
                    </Stack>
                ) : <PlayerLayoutTop />}
                <ProgressBar />
                <Group justify="space-between">
                    <Group>
                        <PlayPauseButton />
                        <VolumeControls />
                        <PlayerTimestamp />
                    </Group>
                    <Group>
                        <LoopButton />
                    </Group>
                </Group>
            </Stack>
        </Paper>
    )
}
