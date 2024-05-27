import { Button, ButtonProps } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { useContext } from "react";
import { OptionsContext } from "../OptionsContext";

export const OpenWithButton = (props: ButtonProps) => {
    const { open, setView } = useContext(OptionsContext);

    return (
        <Button
            variant="light"
            rightSection={<IconExternalLink />}
            onClick={() => {
                open();
                setView("openWith");
            }}
            size="compact-md"
            {...props}
        >
            Open With
        </Button>
    );
};
