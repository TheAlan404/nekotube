import { ActionIcon, Tooltip } from "@mantine/core";
import { useFullscreen } from "@mantine/hooks";
import { IconMaximize, IconMinimize } from "@tabler/icons-react";

export const FullscreenButton = () => {
    const { fullscreen, toggle } = useFullscreen();

    return (
        <Tooltip label={fullscreen ? "Minimize (f)" : "Maximize (f)"}>
            <ActionIcon
                onClick={() => toggle()}
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
