import { ActionIcon, Drawer, Popover, ScrollArea, Tooltip } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { OptionsMenu } from "./OptionsMenu";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { useEffect } from "react";
import { useSoundEffect } from "../../../hooks/useSoundEffect";

export const OptionsButton = () => {
    const [opened, { open, close, toggle }] = useDisclosure(false);
    const openSfx = useSoundEffect(["openSettings"]);
    const closeSfx = useSoundEffect(["closeSettings"]);

    useHotkeys([
        ["o", () => {
            if(opened) {
                closeSfx();
                close();
            } else {
                openSfx();
                open();
            }
        }]
    ]);

    return (
        <>
            <Drawer
                opened={opened}
                size="md"
                onClose={() => { closeSfx(); close(); }}
                position="right"
                title="Options"
                scrollAreaComponent={ScrollArea.Autosize}
            >
                <OptionsMenu />
            </Drawer>
            <Tooltip label="Options (o)">
                <ActionIcon
                    variant="light"
                    color="violet"
                    onClick={() => { openSfx(); open(); }}
                >
                    <IconSettings />
                </ActionIcon>
            </Tooltip>
        </>
    );
};
