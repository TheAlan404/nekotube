import { useLocalStorage } from "@mantine/hooks";
import { createContext, useContext } from "react";

export interface Preferences {
    uiSoundEffects: boolean;
    keepControlsShown: boolean;
    keepVolumeShown: boolean;
    watchPageAnimations: boolean;
    useSponsorBlock: boolean;
    useDeArrow: boolean;
    useReturnYoutubeDislike: boolean;
};

export const DefaultPreferences: Preferences = {
    uiSoundEffects: true,
    keepControlsShown: false,
    keepVolumeShown: false,
    watchPageAnimations: true,
    useSponsorBlock: true,
    useDeArrow: false,
    useReturnYoutubeDislike: true,
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
        deserialize(value) {
            let j: Preferences = JSON.parse(value || JSON.stringify(DefaultPreferences));
            for(let [k, v] of Object.entries(DefaultPreferences))
                if(typeof v === "boolean" && typeof j[k] != typeof v)
                    j[k] = v;
            return j;
        },
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
