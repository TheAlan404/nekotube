import { Group, Stack, StackProps } from "@mantine/core";
import { ProgressBar } from "../bar/ProgressBar";
import { PlayPauseButton } from "../controls/PlayPauseButton";
import { VolumeControls } from "../controls/VolumeControls";
import { PlayerTimestamp } from "../controls/PlayerTimestamp";
import { FormatsButton } from "../../options/links/FormatsButton";
import { OptionsButton } from "../../options/links/OptionsButton";
import { ToggleSidebarButton } from "../../tabs/links/ToggleSidebarButton";
import { FullscreenButton } from "../controls/FullscreenButton";

export const LayoutBottom = (props: StackProps) => {
    return (
        <Stack
            gap="xs"
            p="xs"
            w="100%"
            onClick={(e) => e.stopPropagation()}
            {...props}
        >
            <ProgressBar />

            <Group justify="space-between">
                <Group>
                    <PlayPauseButton />
                    <VolumeControls />
                    <PlayerTimestamp />
                </Group>
                <Group>
                    <FormatsButton />
                    <OptionsButton />
                    <ToggleSidebarButton />
                    <FullscreenButton />
                </Group>
            </Group>
        </Stack>
    );
};
