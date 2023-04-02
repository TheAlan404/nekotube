import { createContext } from 'react';

export const SettingsContext = createContext([
    {
        volume: 1,
        uiSounds: true,
        stretch: true,
        pos: "bottom",
    },
    () => {}
]);

SettingsContext.displayName = "LTRSettingsProvider";
