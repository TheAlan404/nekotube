import { SubtitleNode } from "../types";

export const parseVtt = (vtt: string) => {
    let lines = vtt.replaceAll("\r", "").split("\n");
    let css = "";
    let subs: SubtitleNode[] = [];

    let id: string | null = null;
    let startTime: number | null = null;
    let endTime: number | null = null;
    let acc = "";

    const flush = () => {
        if(!acc) return;
        subs.push({
            text: acc,
            from: startTime,
            to: endTime,
        });
    };

    let mode = "type" as "type" | "ignorecontent" | "content";
    for(let line of lines) {
        if(!line) {
            mode = "type";
            flush();
            continue;
        }

        if(line.startsWith("WEBVTT")) continue;
        if(line.startsWith("NOTE")) continue;
        if(line.startsWith("STYLE")) {
            
        };
    }

    return {
        subs,
        css,
    };
};
