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
    deselect: createUIFX("deselect.wav"),
    keyInvalid: createUIFX("key-invalid.wav"),
    selectAll: createUIFX("select-all.wav"),
    selectChar: createUIFX("select-char.wav"),
    selectWord: createUIFX("select-word.wav"),
    error: createUIFX("error.wav"),
    openSettings: createUIFX("open-settings.wav"),
    closeSettings: createUIFX("close-settings.wav"),
    swoosh: createUIFX("swoosh.wav"),
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
    let confirm = useSoundEffect(["swoosh"]);
    let caps = useSoundEffect(["keyCaps"]);
    let selectAll = useSoundEffect(["selectAll"]);
    let selectChar = useSoundEffect(["selectChar"]);
    let selectWord = useSoundEffect(["selectWord"]);
    let key = useSoundEffect([
        "keyPress1",
        "keyPress2",
        "keyPress3",
        "keyPress4",
    ]);

    return (e: React.KeyboardEvent<HTMLInputElement>) => {
        const isArrow = e.key.includes("Arrow");

        if(e.ctrlKey && e.key == "a") return selectAll();
        if(e.ctrlKey && e.shiftKey && isArrow) return selectWord();
        if(e.shiftKey && isArrow) return selectChar();
        if(isArrow) return movement();

        if (e.key == "Enter") return confirm();
        if (["Delete", "Backspace"].includes(e.key)) return del();

        if (e.key.length == 1) {
            if ((/[A-Z]/g).test(e.key))
                caps(e.repeat ? 0.4 : 0.8)
            else key(e.repeat ? 0.4 : 0.8);
        };
    };
}
