export interface Buffered {
    start: number;
    end: number;
};

export const getBuffered = (t: TimeRanges) => {
    let len = t.length;
    let arr: Buffered[] = [];

    for(let i = 0; i < len; i++) {
        arr.push({
            start: t.start(i),
            end: t.end(i),
        });
    }

    return arr;
};
