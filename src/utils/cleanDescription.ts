import { secondsToTimestamp, timestampToSeconds, TimestampRegex } from "./timestamp";

export type TextPart = {
    type: "text";
    data: string;
    bold: boolean;
    italic: boolean;
} | {
    type: "newline";
} | {
    type: "timestamp";
    time: number;
} | {
    type: "link",
    href: string;
}

export const cleanDescription = (text = "") => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(text.replaceAll("<br>", "\n"), "text/html");

    let body = doc.children[0].children[1];
    let nodes = [...body.childNodes];

    let parts: TextPart[] = [];

    for(let node of nodes) {
        if(node.nodeType == Node.TEXT_NODE) {
            let first = true;
            for (let line of node.nodeValue.split("\n")) {
                if(!first) {
                    parts.push({ type: "newline" });
                } else {
                    first = false;
                }

                if(!line) continue;

                parts.push({
                    type: "text",
                    data: line,
                    bold: false,
                    italic: false,
                });
            }
        } else if(node.nodeType == Node.ELEMENT_NODE) {
            if(node.nodeName == "A") {
                let el = node as HTMLAnchorElement;
                let isTimestamp = TimestampRegex.test(el.textContent);
                if(isTimestamp) {
                    parts.push({
                        type: "timestamp",
                        time: timestampToSeconds(el.textContent),
                    })
                } else {
                    parts.push({
                        type: "link",
                        href: el.href,
                    })
                }
            } else if(node.nodeName == "B") {
                parts.push({
                    type: "text",
                    data: node.nodeValue,
                    bold: true,
                    italic: false,
                });
            } else if(node.nodeName == "BR") {
                parts.push({ type: "newline" });
            } else {
                console.log("Unknown tag", node);
            }
        }
    }

    return parts;
};

export const textPartsToString = (parts: TextPart[]) => {
    return parts.map(part => {
        if(part.type == "text") return part.data;
        if(part.type == "timestamp") return secondsToTimestamp(part.time);
        if(part.type == "link") return part.href;
        if(part.type == "newline") return "\n";
    }).join("");
}
