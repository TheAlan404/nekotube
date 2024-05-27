import { useLocalStorage } from "@mantine/hooks";
import { usePreference } from "./Preferences";

export type HistoryItem = {
    t: "v" | "s",
    d: string,
};

export const useNekoTubeHistory = () => {
    const useLocalHistory = usePreference("useLocalHistory");
    const [value, setValue] = useLocalStorage<HistoryItem[]>({
        key: "nekotube:history",
        defaultValue: [],
    });

    return {
        history: value,
        setHistory: setValue,
        add: (item: HistoryItem) => {
            if(!useLocalHistory) return;

            setValue(v => [...v, item]);
        },
        clear: () => setValue([]),
    };
};
