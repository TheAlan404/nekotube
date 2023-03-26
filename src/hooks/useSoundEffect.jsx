import { showNotification } from "@mantine/notifications";
import { useContext } from "react";
import UIFx from "uifx";
import { SettingsContext } from "../contexts/SettingsContext";

const SOUNDS = Object.fromEntries([
    "key-caps",
    "key-confirm",
    "key-delete",
    "key-movement",
    "key-press-1",
    "key-press-2",
    "key-press-3",
    "key-press-4",
].map(n => [n, new UIFx("/assets/sfx/" + n + ".mp3", {
    throttleMs: 50,
    volume: n.includes("press") ? 0.6 : 1,
})]));

export function useSoundEffect(id) {
    const { uiSounds } = useContext(SettingsContext);

    if (!uiSounds) return () => { };

    if (Array.isArray(id)) {
        return () => {
            let sfx = id[Math.floor((Math.random() * id.length))];
            SOUNDS[sfx].play();
        };
    } else {
        return () => {
            SOUNDS[id].play();
        };
    }
}

export function useKeyboardSfx() {
    let del = useSoundEffect("key-delete");
    let movement = useSoundEffect("key-movement");
    let confirm = useSoundEffect("key-confirm");
    let caps = useSoundEffect("key-caps");
    let key = useSoundEffect([1, 2, 3, 4].map(x => "key-press-" + x));

    return (e) => {
        if (e.key.includes("Arrow")) {
            movement();
            return;
        };

        if (e.key == "Enter") {
            confirm();
            return;
        }

        if (["Delete", "Backspace"].includes(e.key)) {
            del();
            return;
        }

        if (e.key.length == 1) {
            if ((/[A-Z]/g).test(e.key))
                caps(e.key.repeating ? 0.4 : 0.8)
            else key(e.key.repeating ? 0.4 : 0.8);
        };
    };
}