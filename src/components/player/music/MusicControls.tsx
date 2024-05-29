import { Group, Paper, Stack } from "@mantine/core"
import { PlayPauseButton } from "../controls/PlayPauseButton"
import { VolumeControls } from "../controls/VolumeControls"
import { PlayerTimestamp } from "../controls/PlayerTimestamp"
import { ProgressBar } from "../bar/ProgressBar"
import { LoopButton } from "../controls/LoopButton"
import { PlayerLayoutTop } from "../layout/LayoutTop"

export const MusicControls = () => {
    return (
        <Paper withBorder p="sm" bg="dark">
            <Stack>
                <PlayerLayoutTop />
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
