import { clamp } from "@mantine/hooks";
import { Chapter } from "../../../api/types/video";

export interface Segment {
    start: number;
    end: number;
    value: number;
    label: string;
};

export const calculateSegments = ({
    chapters,
    progress,
    duration,
}: {
    chapters: Chapter[];
    progress: number;
    duration: number;
}): Segment[] => {
    if(!chapters.length) return [{
        start: 0,
        end: 100,
        label: "",
        value: (progress / duration) * 100,
    }];

    let segments: Segment[] = [];

    if(chapters[0]?.time > 0) {
        let startTime = 0;
        let endTime = chapters[0]?.time || duration;

        let startPer = startTime / duration;
        let endPer = (endTime / duration) - startPer;

        segments.push({
            start: startPer * 100,
            end: endPer * 100,
            value: clamp(0, (progress - startTime) / (endTime - startTime), 1) * 100,
            label: "",
        });
    }

    for(let i = 0; chapters[i]; i++) {
        let currentChapter = chapters[i];
        let nextChapter = chapters[i+1];

        let startTime = currentChapter.time;
        let endTime = nextChapter?.time || duration;

        let startPer = startTime / duration;
        let endPer = (endTime / duration) - startPer;

        segments.push({
            start: startPer * 100,
            end: endPer * 100,
            value: clamp(0, (progress - startTime) / (endTime - startTime), 1) * 100,
            label: currentChapter.label,
        });
    };

    return segments;
};
