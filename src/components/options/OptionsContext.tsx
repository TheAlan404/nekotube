import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { createContext, useState } from "react";
import { useSoundEffect } from "../../hooks/useSoundEffect";
import { Drawer, ScrollArea } from "@mantine/core";
import { OptionsRouter } from "./OptionsRouter";

export type OptionsView = "main" | "instanceSelect";

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
    open: () => {},
    close: () => {},
    toggle: () => {},
    view: "main",
    setView: () => {},
});

export const OptionsProvider = ({ children }: React.PropsWithChildren) => {
    const [opened, handlers] = useDisclosure(false);
    const [view, setView] = useState<OptionsView>("main");
    const openOptionsSfx = useSoundEffect(["openSettings"]);
    const closeOptionsSfx = useSoundEffect(["closeSettings"]);

    const open = () => {
        if(!opened) openOptionsSfx();
        handlers.open();
    };

    const close = () => {
        if(opened) closeOptionsSfx();
        handlers.close();
        setView("main");
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
                view,
                setView,
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
                <OptionsRouter />
            </Drawer>
            {children}
        </OptionsContext.Provider>
    );
};
