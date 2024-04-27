export const secondsToTimestamp = (secs: number) => {
    let d = new Date(secs * 1000);

    let h = (d.getHours() - 2).toString().padStart(2, "0");
    let m = d.getMinutes().toString().padStart(2, "0");
    let s = d.getSeconds().toString().padStart(2, "0");

    return (
        h == "00" ? [m, s] : [h, m, s]
    ).join(":");
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
