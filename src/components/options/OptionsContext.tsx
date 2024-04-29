import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { createContext } from "react";
import { useSoundEffect } from "../../hooks/useSoundEffect";
import { Drawer, ScrollArea } from "@mantine/core";
import { OptionsMenu } from "./OptionsMenu";

export interface OptionsContextAPI {
    opened: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
};

export const OptionsContext = createContext<OptionsContextAPI>({
    opened: false,
    open: () => {},
    close: () => {},
    toggle: () => {},
});

export const OptionsProvider = ({ children }: React.PropsWithChildren) => {
    const [opened, handlers] = useDisclosure(false);
    const openOptionsSfx = useSoundEffect(["openSettings"]);
    const closeOptionsSfx = useSoundEffect(["closeSettings"]);

    const open = () => {
        if(opened) return;
        openOptionsSfx();
        handlers.open();
    };

    const close = () => {
        if(!opened) return;
        closeOptionsSfx();
        handlers.close();
    };

    const toggle = () => {
        if(opened) {
            close();
        } else {
            open();
        }
    };

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
            }}
        >
            <Drawer
                opened={opened}
                size="md"
                onClose={() => close()}
                position="right"
                title="Options"
                scrollAreaComponent={ScrollArea.Autosize}
            >
                <OptionsMenu />
            </Drawer>
            {children}
        </OptionsContext.Provider>
    );
};
