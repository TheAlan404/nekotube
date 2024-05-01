import { Button } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useContext } from "react";
import { OptionsContext } from "../OptionsContext";

export const ChangeInstanceButton = () => {
    const { open, setView } = useContext(OptionsContext);

    return (
        <Button
            color="violet"
            variant="light"
            leftSection={<IconSettings />}
            onClick={() => {
                open();
                setView("instanceSelect");
            }}
            size="compact-md"
        >
            Change Instance
        </Button>
    );
};
