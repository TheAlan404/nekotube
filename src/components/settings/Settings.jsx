import { Checkbox, Stack } from '@mantine/core';
import React, { useContext } from 'react'
import { SettingsContext } from '../../contexts/SettingsContext'

const Settings = () => {
    let [pref, set] = useContext(SettingsContext);

    let renderers = {
        bool: ({ id, label }) => <Checkbox
            checked={pref[id]}
            onChange={(event) =>
                set({ [id]: event.currentTarget.checked })} label={label} />
    };

    return (
        <>
            <Stack>
                {renderers.bool({ id: "uiSounds", label: "UI Sounds" })}
                {renderers.bool({ id: "useProxy", label: "Use lighttube proxy" })}
                {renderers.bool({ id: "keepControls", label: "Dont hide player UI" })}
            </Stack>
        </>
    )
}

export default Settings
