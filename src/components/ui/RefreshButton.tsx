import { ActionIcon, Tooltip } from "@mantine/core";
import { IconReload } from "@tabler/icons-react";

export const RefreshButton = ({
    onClick,
}: {
    onClick?: () => void,
}) => {
    return (
        <Tooltip label="Refresh" withArrow>
            <ActionIcon
                variant="light"
                
                onClick={onClick}
            >
                <IconReload />
            </ActionIcon>
        </Tooltip>
    );
};
