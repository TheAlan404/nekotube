import { ActionIcon, Tooltip } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useContext } from "react";
import { OptionsContext } from "../OptionsContext";

export const OptionsButton = () => {
    const { open } = useContext(OptionsContext);

    return (
        <Tooltip label="Options (o)">
            <ActionIcon
                variant="light"
                onClick={() => open()}
            >
                <IconSettings />
            </ActionIcon>
        </Tooltip>
    );
};
