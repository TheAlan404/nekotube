export function getQuery(q) {
    return new URLSearchParams(window.location.search).get(q) || "";
}

export function getQueryLoc(loc, q) {
    return new URLSearchParams(loc.search).get(q) || "";
}

export function createQuery(q) {
    return new URLSearchParams(q).toString();
}

export function toTimestamp(n) {
    let d = new Date(n * 1000);
    console.log(n, d);

    if((d.getHours() - 2))
        return (d.getHours() - 2)
            + ":" + d.getMinutes().toString().padStart(2, "0")
            + ":" + d.getSeconds().toString().padStart(2, "0");

    return d.getMinutes().toString() + ":" + d.getSeconds().toString().padStart(2, "0");
}

export function timeFromTimestamp(t = "") {
    let list = t.trim().split(":").reverse().map(i => Number(i));
    let acc = 0;
    acc += (list[0] || 0);
    acc += (list[1] || 0) * 60;
    acc += (list[2] || 0) * 60 * 60;
    acc += (list[3] || 0) * 60 * 60 * 24;
    return acc;
}

export function cap(v, h = 1, l = 0) {
    return Math.max(Math.min(v, h), l);
}

export const timestampRegex = new RegExp(/([0-9]{1,2}:)?[0-9]{1,2}:[0-9]{1,2}/g);

const fixup = (s) => s.trim().startsWith("-") ? s.trim().replace("-", "").trim() : s.trim();

export function parseChapters(text = "") {
    let lines = text.split(/\n+/g);
    let chapters = [];
    for(let line of lines) {
        let matches = line.match(timestampRegex);
        if(!matches) continue;
        chapters.push({
            time: timeFromTimestamp(matches[0]),
            name: line.replace(timestampRegex, "").trim(),
        });
    };

    return chapters
        .sort((a, b) => a.time - b.time)
        .map(c => ({ time: c.time, name: fixup(c.name) }));
}

export function calcChapterSegments({
    chapters,
    progress,
    duration,
}) {
    if(!chapters || !chapters.length) return [{ pos: [0, 100], value: progress / duration * 100 }];
    let segments = [];

    for(let i = 0 ; chapters[i] ; i++) {
        let startTime = chapters[i].time;
        let endTime = chapters[i + 1]?.time || duration;

        let startPer = startTime / duration;
        let endPer = (endTime / duration) - startPer;

        let value = Math.min(
            1,
            Math.max(
                0,
                (progress - startTime) / (endTime - startTime)
            )
        );

        segments.push({
            pos: [startPer * 100, endPer * 100],
            value: value * 100,
            name: chapters[i].name,
        });
    };

    return segments;
}

export function chunkifySearchSuggestions(search = "", suggest = "") {
    let acc = "";
    let last = false;
    let list = search.split("");
    let chunks = [];
    for (let char of suggest) {
        if (list.includes(char)) {
            if (!last) {
                chunks.push({
                    text: acc,
                    includes: false,
                });
                acc = "";
            }

            last = true;
            acc += list.splice(list.indexOf(char), 1);
        } else {
            if (last) {
                chunks.push({
                    text: acc,
                    includes: true,
                });
                acc = "";
            }

            last = false;
            acc += char;
        }
    };

    if (acc) {
        chunks.push({
            text: acc,
            includes: last,
        });
    };

    return chunks;
};
