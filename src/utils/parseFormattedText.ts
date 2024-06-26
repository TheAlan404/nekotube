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
    type: "link";
    href: string;
} | {
    type: "channel";
    id: string;
} | {
    type: "hashtag";
    data: string;
} | {
    type: "videoLink";
    id: string;
    time?: number;
};

export const parseFormattedText = (text = "") => {
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

                let href = el.getAttribute("href");
                
                if(TimestampRegex.test(el.textContent)) {
                    parts.push({
                        type: "timestamp",
                        time: timestampToSeconds(el.textContent),
                    })
                } else if (href.startsWith("/channel/") || href.startsWith("/c/") || href.startsWith("/user/")) {
                    let id = href.split("/")[2];

                    if(id.startsWith("@")) id = id.slice(1);
                    
                    parts.push({
                        type: "channel",
                        id: id.split("?")[0],
                    })
                } else if(href.startsWith("/@")) {
                    parts.push({
                        type: "channel",
                        id: href.slice(2).split("?")[0],
                    })
                } else if(href.startsWith("/hashtag/")) {
                    parts.push({
                        type: "hashtag",
                        data: href.split("/")[2],
                    })
                } else if(href.startsWith("/watch")) {
                    parts.push({
                        type: "videoLink",
                        id: href.replace("/watch?v=", "").split("&t=")[0],
                        time: Number(
                            href.replace("/watch?v=", "").split("&t=")[1]
                        ) || null,
                    });
                } else if(href.startsWith("/shorts")) {

                } else if(href.startsWith("/post/")) {
                    /* parts.push({
                        type: "post",
                        data: href.split("/")[2],
                    }) */
                } else if(href.startsWith("/")) {
                    parts.push({
                        type: "text",
                        data: href,
                        bold: true,
                        italic: false,
                    })
                } else {
                    parts.push({
                        type: "link",
                        href: href,
                    })
                }
            } else if(node.nodeName == "I") {
                parts.push({
                    type: "text",
                    data: node.nodeValue,
                    bold: false,
                    italic: true,
                });
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
