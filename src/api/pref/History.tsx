import { useLocalStorage } from "@mantine/hooks";
import { usePreference } from "./Preferences";

export type PartialHistoryItem = ["v" | "s", string];
export type HistoryItem = ["v" | "s", string, number];

export const useNekoTubeHistory = () => {
    const useLocalHistory = usePreference("useLocalHistory");
    const [value, setValue] = useLocalStorage<HistoryItem[]>({
        key: "nekotube:history",
        defaultValue: [],
    });

    return {
        history: value,
        setHistory: setValue,
        add: (partial: PartialHistoryItem) => {
            if(!useLocalHistory) return;

            let item = [...partial, Date.now()] as HistoryItem;

            setValue(v => {
                if(item[0] == "s") {
                    let contains = v.some(([t, d]) => t == "s" && d == item[1]);

                    if (contains)
                        return v.map(([t, d, ts]) => (t == "s" && d == item[1]) ? [t, d, Date.now()] : [t, d, ts]);
                    else
                        return [...v, item];
                } else {
                    let last = v[v.length - 1];

                    if(last && last[0] == "v" && last[1] == item[1]) return v.map((item, idx, arr) => (idx == (arr.length - 1)) ? [item[0], item[1], Date.now()] : item);
                    return [...v, item];
                }
            });
        },
        clear: () => setValue([]),
    };
};
