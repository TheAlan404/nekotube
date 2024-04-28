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
        </Stack>
    );
};
