import { Chapter } from "../api/types/chapter";
import { cleanDescription } from "./cleanDescription";
import { timestampToSeconds } from "./timestamp";

const trimChapterName = (s: string) => s.trim().startsWith("-") ? s.trim().replace("-", "").trim() : s.trim();

export const TimestampRegex = /([0-9]{1,2}:)?[0-9]{1,2}:[0-9]{1,2}/g;

export const parseChapters = (description: string): Chapter[] => {
    let text = cleanDescription(description);
    let lines = text.split("\n");
    let chapters: Chapter[] = [];
    let group = "";

    for(let line of lines) {
        if(!line) continue;
        let matches = line.match(TimestampRegex);
        if(!matches) {
            group = line;
            continue;
        };

        chapters.push({
            time: timestampToSeconds(matches[0]),
            label: trimChapterName(line.replace(TimestampRegex, "")),
            group,
        });
    };

    let sorted = chapters.sort((a, b) => a.time - b.time);
    return sorted;
};
