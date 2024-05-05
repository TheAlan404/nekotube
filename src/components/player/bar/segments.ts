import { clamp } from "@mantine/hooks";
import { Chapter } from "../../../api/types/chapter";
import { Buffered } from "../../../utils/getBuffered";

export interface Position {
    start: number;
    end: number;
};

export interface Segment {
    position: Position;
    progress: number;
    buffered: Position[];
    label: string;
};

export const calculateSegments = ({
    chapters: originalChapters,
    progress,
    duration,
    buffered,
}: {
    chapters: Chapter[];
    progress: number;
    duration: number;
    buffered: Buffered[];
}): Segment[] => {
    let chapters = originalChapters.reduce((arr, c) => arr.some(x => x.time == c.time) ? arr : [...arr, c], []);

    // |  =======      ===      |
    // |      |.....|      |    |
    const getBufferedPositions = (startTime: number, endTime: number): Position[] => {
        let pos: Position[] = [];

        for(let buf of buffered) {
            if(endTime < buf.start) continue;
            if(startTime > buf.end) continue;

            // 0-aligned
            let bufferStart = Math.max(0, buf.start - startTime);
            let bufferEnd = Math.min(buf.end, endTime) - startTime;

            let chapterDuration = endTime - startTime;
            pos.push({
                start: (bufferStart / chapterDuration) * 100,
                end: (bufferEnd / chapterDuration) * 100,
            });
        }

        return pos;
    };

    if(!chapters.length) return [{
        position: {
            start: 0,
            end: 100,
        },
        label: "",
        progress: (progress / duration) * 100,
        buffered: getBufferedPositions(0, duration),
    }];

    let segments: Segment[] = [];

    if(chapters[0]?.time > 0) {
        let startTime = 0;
        let endTime = chapters[0]?.time || duration;

        let startPer = startTime / duration;
        let endPer = (endTime / duration) - startPer;

        segments.push({
            position: {
                start: startPer * 100,
                end: endPer * 100,
            },
            progress: clamp(0, (progress - startTime) / (endTime - startTime), 1) * 100,
            buffered: getBufferedPositions(startTime, endTime),
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
            position: {
                start: startPer * 100,
                end: endPer * 100,
            },
            progress: clamp(0, (progress - startTime) / (endTime - startTime), 1) * 100,
            buffered: getBufferedPositions(startTime, endTime),
            label: currentChapter.label,
        });
    };

    return segments;
};
