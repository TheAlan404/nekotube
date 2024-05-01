import { ActionIcon, Tooltip } from "@mantine/core";
import { IconAdjustments, IconSettings } from "@tabler/icons-react";
import { useContext } from "react";
import { OptionsContext } from "../OptionsContext";

export const FormatsButton = () => {
    const { open, setView } = useContext(OptionsContext);

    return (
        <Tooltip label="Select Format">
            <ActionIcon
                variant="light"
                color="violet"
                onClick={() => {
                    open();
                    setView("formatSelect");
                }}
            >
                <IconAdjustments />
            </ActionIcon>
        </Tooltip>
    );
};
