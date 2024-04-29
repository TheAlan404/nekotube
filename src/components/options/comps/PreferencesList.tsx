import { useContext } from "react";
import { PreferencesContext } from "../../../api/pref/Preferences";
import { Checkbox, Stack } from "@mantine/core";

export const PreferencesList = () => {
    const { pref, set } = useContext(PreferencesContext);

    return (
        <Stack w="100%">
            <Checkbox
                label="UI sound effects"
                checked={pref.uiSoundEffects}
                onChange={(e) => set({ uiSoundEffects: e.currentTarget.checked })}
            />
            <Checkbox
                label="Keep controls shown"
                description={"Video controls will fade away when not hovered if unchecked"}
                checked={pref.keepControlsShown}
                onChange={(e) => set({ keepControlsShown: e.currentTarget.checked })}
            />
            <Checkbox
                label="Keep volume shown"
                description={"Check to keep volume slider visible"}
                checked={pref.keepVolumeShown}
                onChange={(e) => set({ keepVolumeShown: e.currentTarget.checked })}
            />
        </Stack>
    );
};
