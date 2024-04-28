import UIFx from "uifx";
import { randArr } from "../utils/math";
import { usePreference } from "../api/pref/Preferences";

export const createUIFX = (id: string, volume = 1) => new UIFx("/assets/sfx/" + id, {
    throttleMs: 50,
    volume,
});

export const UISfxLibrary = {
    keyCaps: createUIFX("key-caps.mp3"),
    keyConfirm: createUIFX("key-confirm.mp3"),
    keyDelete: createUIFX("key-delete.mp3"),
    keyMovement: createUIFX("key-movement.mp3"),
    keyPress1: createUIFX("key-press-1.mp3", 0.6),
    keyPress2: createUIFX("key-press-2.mp3", 0.6),
    keyPress3: createUIFX("key-press-3.mp3", 0.6),
    keyPress4: createUIFX("key-press-4.mp3", 0.6),
    error: createUIFX("error.wav"),
    openSettings: createUIFX("open-settings.wav"),
    closeSettings: createUIFX("close-settings.wav"),
};

export type SfxName = keyof typeof UISfxLibrary;
export const useSoundEffect = (ids: SfxName[]) => {
    let uiSoundEffects = usePreference("uiSoundEffects");
    let sfx = ids.map(id => UISfxLibrary[id]);

    return (volume?: number) => {
        if(!uiSoundEffects) return;
        randArr(sfx).play(volume);
    };
};

export const useKeyboardSfx = () => {
    let del = useSoundEffect(["keyDelete"]);
    let movement = useSoundEffect(["keyMovement"]);
    let confirm = useSoundEffect(["keyConfirm"]);
    let caps = useSoundEffect(["keyCaps"]);
    let key = useSoundEffect([
        "keyPress1",
        "keyPress2",
        "keyPress3",
        "keyPress4",
    ]);

    return (e: KeyboardEvent) => {
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
                caps(e.repeat ? 0.4 : 0.8)
            else key(e.repeat ? 0.4 : 0.8);
        };
    };
}
