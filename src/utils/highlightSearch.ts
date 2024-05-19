export const highlightSearch = (query: string, suggestion: string): {
    text: string;
    highlight: boolean;
}[] => {
    let acc = "";
    let last = false;
    let queryLetters = query.split("");
    let chunks: { text: string; highlight: boolean }[] = [];
    for (let char of suggestion) {
        if (queryLetters.includes(char)) {
            if (!last) {
                chunks.push({
                    text: acc,
                    highlight: false,
                });
                acc = "";
            }

            last = true;
            acc += queryLetters.splice(queryLetters.indexOf(char), 1);
        } else {
            if (last) {
                chunks.push({
                    text: acc,
                    highlight: true,
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
            highlight: last,
        });
    };

    return chunks;
};
