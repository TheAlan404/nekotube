import { ActionIcon, Tooltip } from "@mantine/core";
import { IconMaximize, IconMinimize } from "@tabler/icons-react";

export const FullscreenButton = ({
    fullscreen,
    toggleFullscreen,
}: {
    fullscreen: boolean,
    toggleFullscreen: () => void,
}) => {
    return (
        <Tooltip label={fullscreen ? "Minimize" : "Maximize"}>
            <ActionIcon
                onClick={() => toggleFullscreen()}
                variant="light"
                color="violet"
            >
                {fullscreen ? (
                    <IconMinimize />
                ) : (
                    <IconMaximize />
                )}
            </ActionIcon>
        </Tooltip>
    );
};
