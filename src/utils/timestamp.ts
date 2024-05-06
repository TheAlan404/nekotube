export const secondsToTimestamp = (secs: number) => {
    let t = new Date(secs * 1000).toISOString()
        .split("T")[1]
        .split(".")[0];
    
    return t.startsWith("00:") ? t.slice(3) : t;
}

export const timestampToSeconds = (ts: string) => {
    let list = ts.trim().split(":").reverse().map(i => Number(i));
    let acc = 0;
    acc += (list[0] || 0);
    acc += (list[1] || 0) * 60;
    acc += (list[2] || 0) * 60 * 60;
    acc += (list[3] || 0) * 60 * 60 * 24;
    return acc;
};

export const TimestampRegex = /([0-9]{1,2}:)?[0-9]{1,2}:[0-9]{1,2}/;
