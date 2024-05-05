// @author kuylar
export function getFlagEmoji(countryCode: string) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

// reversed logic by dennis
export const getRegionFromEmoji = (emoji: string) => {
    let codePoints = emoji
        .split("")
        .map((x, i, a) => i%2 ? null : a[i]+a[i+1])
        .filter(x => x)
        .map(x => x.charCodeAt(0) + x.charCodeAt(1))
        .map(x => x - 112097);
    return String.fromCodePoint(...codePoints);
};
