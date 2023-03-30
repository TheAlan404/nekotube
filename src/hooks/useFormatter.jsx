import { Badge, Text } from "@mantine/core";
import { useContext } from "react";
import Timestamp from "../components/buttons/Timestamp";
import { UIContext } from "../contexts/UIContext";
import { timeFromTimestamp, timestampRegex } from "../lib/utils";

const boldRegex = /(<b>)(.+)(<\/b>)/g;

export default function useFormatter() {
    // <a href=\"https://youtube.com/watch?v=dy90tA3TT1c&t=130s\">2:10</a>

    let text = ({ item, i }) => <Text span key={i}>{item}</Text>;
    let bold = ({ item, i }) => <Text span key={i} fw="bold">{item}</Text>;
    let timestamp = ({ item, i }) => <Timestamp key={i} time={timeFromTimestamp(item)} />;

    return (s) => {
        s = s.replace(/\n/g, "<br>");
        s = s.replace(/(<a href\=\")(.+)(\">)(.+)(<\/a>)/g, (match, p1, uri, p3, content, p5) => {
            return content;
        });

        let list = s.split(/(<br>|<b>.+<\/b>|[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}|[0-9]{1,2}:[0-9]{1,2})/);

        console.debug(list);

        return list.filter(x => x).map((item, i) => {
            if (item == "<br>") return <br key={i}></br>;
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