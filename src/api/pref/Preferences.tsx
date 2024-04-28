import { useLocalStorage } from "@mantine/hooks";
import { createContext, useContext } from "react";

export interface Preferences {
    uiSoundEffects: boolean;
};

export const DefaultPreferences: Preferences = {
    uiSoundEffects: true,
};

export interface PreferencesAPI {
    pref: Preferences;
    set: (pref: Partial<Preferences>) => void,
};

export const PreferencesContext = createContext<PreferencesAPI>({
    pref: DefaultPreferences,
    set: () => {},
});

export const PreferencesProvider = ({ children }: React.PropsWithChildren) => {
    const [preferences, setPreferences] = useLocalStorage({
        key: "nekotube:preferences",
        defaultValue: DefaultPreferences,
    });

    return (
        <PreferencesContext.Provider
            value={{
                pref: preferences,
                set: (pref) => {
                    setPreferences(p => ({ ...p, ...pref }));
                },
            }}
        >
            {children}
        </PreferencesContext.Provider>
    );
};

export const usePreference = <T extends keyof Preferences>(key: T) => {
    const { pref } = useContext(PreferencesContext);
    return pref[key];
};
