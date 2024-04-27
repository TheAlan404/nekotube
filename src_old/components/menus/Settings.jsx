import { Checkbox, Divider, Stack } from '@mantine/core';
import React, { useContext } from 'react'
import { SettingsContext } from '../../contexts/SettingsContext'

const Settings = () => {
    let [pref, set] = useContext(SettingsContext);

    let category = (c) => <Divider my="xs" label={c} labelPosition="center" />

    let renderers = {
        bool: ({ id, label }) => <Checkbox
            checked={pref[id] === undefined ? false : pref[id]}
            onChange={(event) =>
                set({ [id]: event.currentTarget.checked })} label={label} />
    };

    return (
        <>
            <Stack>
                {category("User Interface")}
                {renderers.bool({ id: "uiSounds", label: "UI Sounds" })}
                {category("Player")}
                {renderers.bool({ id: "useProxy", label: "Use lighttube proxy" })}
                {renderers.bool({ id: "saveProgress", label: "Save progress when exiting" })}
                {category("Player Interface")}
                {renderers.bool({ id: "keepControls", label: "Dont hide player UI" })}
                {renderers.bool({ id: "disablePlayerPopups", label: "Disable all popups" })}
                {category("Experimental / Beta")}
                {renderers.bool({ id: "ux_tabButtons", label: "UX: Tab buttons" })}
            </Stack>
        </>
    )
}

export default Settings
