import { ActionIcon, Tooltip } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useContext } from "react";
import { OptionsContext } from "../OptionsContext";

export const OptionsButton = () => {
    const { toggle } = useContext(OptionsContext);

    return (
        <Tooltip label="Options (o)">
            <ActionIcon
                variant="light"
                color="violet"
                onClick={() => toggle()}
            >
                <IconSettings />
            </ActionIcon>
        </Tooltip>
    );
};
