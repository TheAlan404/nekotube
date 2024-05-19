import { Chapter } from "../api/types/chapter";
import { parseFormattedText } from "./parseFormattedText";

const trimChapterName = (s: string) => s.trim().startsWith("-") ? s.trim().replace("-", "").trim() : s.trim();

export const parseChapters = (description: string): Chapter[] => {
    let parts = parseFormattedText(description);
    let chapters: Chapter[] = [];

    let group = "";
    let time = null;
    let label = "";
    const flush = () => {
        if(time === null && label) {
            group = label;
        }

        if(time !== null && label) chapters.push({
            time,
            label: trimChapterName(label),
            group,
        });

        label = "";
        time = null;
    };

    for(let part of parts) {
        if(part.type == "newline") {
            flush();
            continue;
        };

        if(part.type == "text") label += part.data;
        if(part.type == "link") label += part.href;

        if(part.type == "timestamp") {
            time = part.time;
        }
    }

    flush();

    console.log("Parsed chapters", chapters);

    let sorted = chapters.sort((a, b) => a.time - b.time);
    return sorted;
};
