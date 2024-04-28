import { ActionIcon, Tooltip } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";

export const OptionsButton = ({
    open
}: {
    open: () => void,
}) => {
    return (
        <Tooltip label="Options (o)">
            <ActionIcon
                variant="light"
                color="violet"
                onClick={() => open()}
            >
                <IconSettings />
            </ActionIcon>
        </Tooltip>
    );
};
