import { Group, Stack, StackProps } from "@mantine/core";
import { ProgressBar } from "../bar/ProgressBar";
import { PlayPauseButton } from "../controls/PlayPauseButton";
import { VolumeControls } from "../controls/VolumeControls";
import { PlayerTimestamp } from "../controls/PlayerTimestamp";
import { FormatsButton } from "../../options/links/FormatsButton";
import { OptionsButton } from "../../options/links/OptionsButton";
import { ToggleSidebarButton } from "../../tabs/links/ToggleSidebarButton";
import { FullscreenButton } from "../controls/FullscreenButton";
import { useIsMobile } from "../../../hooks/useIsMobile";

export const LayoutBottom = (props: StackProps) => {
    const isMobile = useIsMobile();

    let gap = isMobile ? "5px" : "xs";

    return (
        <Stack
            gap={gap}
            p={gap}
            w="100%"
            onClick={(e) => e.stopPropagation()}
            {...props}
        >
            <ProgressBar />

            <Group justify="space-between" wrap="nowrap">
                <Group gap={gap} wrap="nowrap">
                    <PlayPauseButton />
                    <VolumeControls />
                    <PlayerTimestamp />
                </Group>
                <Group gap={gap} wrap="nowrap">
                    {!isMobile && <FormatsButton />}
                    <OptionsButton />
                    {!isMobile && <ToggleSidebarButton />}
                    <FullscreenButton />
                </Group>
            </Group>
        </Stack>
    );
};
