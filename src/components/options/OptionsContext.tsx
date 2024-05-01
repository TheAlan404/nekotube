import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { createContext, useCallback, useState } from "react";
import { useSoundEffect } from "../../hooks/useSoundEffect";
import { Button, Drawer, Group, ScrollArea, Text } from "@mantine/core";
import { OptionsRouter } from "./OptionsRouter";
import { IconArrowLeft } from "@tabler/icons-react";

export type OptionsView = "main" | "instanceSelect" | "openWith" | "formatSelect";

export interface OptionsContextAPI {
    opened: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    view: OptionsView;
    setView: (view: OptionsView) => void;
};

export const OptionsContext = createContext<OptionsContextAPI>({
    opened: false,
    open: () => { },
    close: () => { },
    toggle: () => { },
    view: "main",
    setView: () => { },
});

export const OptionsProvider = ({ children }: React.PropsWithChildren) => {
    const [opened, handlers] = useDisclosure(false);
    const [view, setView] = useState<OptionsView>("main");
    const openOptionsSfx = useSoundEffect(["openSettings"]);
    const closeOptionsSfx = useSoundEffect(["closeSettings"]);

    const open = useCallback(() => {
        if (!opened) openOptionsSfx();
        handlers.open();
    }, [opened]);

    const close = useCallback(() => {
        if (opened) closeOptionsSfx();
        handlers.close();
        setView("main");
    }, [opened]);

    const toggle = useCallback(() => {
        if (opened) {
            close();
        } else {
            open();
        }
    }, [opened]);

    useHotkeys([
        ["o", () => toggle()],
    ]);

    useHotkeys([
        ["Ctrl + o", () => toggle()],
    ], [], true);

    return (
        <OptionsContext.Provider
            value={{
                opened,
                open,
                close,
                toggle,
                view,
                setView,
            }}
        >
            <Drawer
                opened={opened}
                keepMounted
                size="md"
                onClose={() => close()}
                position="right"
                scrollAreaComponent={ScrollArea.Autosize}
                styles={{
                    title: {
                        width: "100%",
                    }
                }}
                title={(
                    <Group w="100%" grow>
                        {view !== "main" && (
                            <Button
                                variant="light"
                                color="violet"
                                leftSection={<IconArrowLeft />}
                                onClick={() => setView("main")}
                                fullWidth
                                size="compact-md"
                            >
                                Back
                            </Button>
                        )}
                        <Text>
                            {({
                                main: "Options",
                                formatSelect: "Select Format",
                                instanceSelect: "Select Instance",
                                openWith: "Open with...",
                            } as Record<OptionsView, string>)[view]}
                        </Text>
                    </Group>
                )}
            >
                <OptionsRouter />
            </Drawer>
            {children}
        </OptionsContext.Provider>
    );
};
