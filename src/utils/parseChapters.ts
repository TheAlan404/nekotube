import { Chapter } from "../api/types/video";
import { cleanDescription } from "./cleanDescription";
import { timestampToSeconds } from "./timestamp";

const trimChapterName = (s: string) => s.trim().startsWith("-") ? s.trim().replace("-", "").trim() : s.trim();

export const TimestampRegex = /([0-9]{1,2}:)?[0-9]{1,2}:[0-9]{1,2}/g;

export const parseChapters = (description: string): Chapter[] => {
    let text = cleanDescription(description);
    let lines = text.split("\n");
    let chapters: Chapter[] = [];

    for(let line of lines) {
        let matches = line.match(TimestampRegex);
        if(!matches) continue;

        chapters.push({
            time: timestampToSeconds(matches[0]),
            label: trimChapterName(line.replace(TimestampRegex, "")),
        });
    };

    let sorted = chapters.sort((a, b) => a.time - b.time);
    return sorted;
};
