import { Badge, Text } from "@mantine/core";
import { useContext } from "react";
import { UIContext } from "../contexts/UIContext";
import { timeFromTimestamp, timestampRegex } from "../lib/utils";

const boldRegex = /(<b>)(.+)(<\/b>)/g;

export default function useFormatter() {
    // <a href=\"https://youtube.com/watch?v=dy90tA3TT1c&t=130s\">2:10</a>
    let [{ }, set] = useContext(UIContext);

    let text = ({ item, i }) => <Text span key={i}>{item}</Text>;
    let bold = ({ item, i }) => <Text span key={i} fw="bold">{item}</Text>;
    let timestamp = ({ item, i }) => <Text span sx={(theme) => ({
        ...theme.fn.hover(),
        cursor: "pointer",
        padding: "0.1rem",
        background: theme.fn.variant({ variant: "light" }).background,
        color: theme.fn.variant({ variant: "light" }).color,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.fn.radius("sm"),
        WebkitTapHighlightColor: 'transparent',
    })} key={i} onClick={() => set({ jumpTo: timeFromTimestamp(item) })}>{item}</Text>

    return (s) => {
        s = s.replace(/\n/g, "<br>");
        // // s = s.replace(/<\/a>/g, "");
        s = s.replace(/(<a href\=\")(.+)(\">)(.+)(<\/a>)/g, (match, p1, uri, p3, content, p5) => {
            return content;
            if (timestampRegex.test(content.trim())) {
                return content.trim();
            } else {
                // just a link, leave as is..?
                return match;
            }
        });

        let list = s.split(/(<br>|<b>.+<\/b>|[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}|[0-9]{1,2}:[0-9]{1,2})/);

        console.debug(list);

        return list.filter(x => x).map((item, i) => {
            if (item == "<br>") return <br></br>;
            if (timestampRegex.test(item)) return timestamp({ item, i });
            if (boldRegex.test(item)) {
                return bold({
                    i,
                    item: item.replace(boldRegex, (m, g1, g2, g3) => g2),
                });
            };
            return text({ item, i });
        });
    };
}