import { Box, Text, TypographyStylesProvider } from "@mantine/core";
import { useMemo } from "react";
import { TimestampButton } from "./TimestampButton";
import { timestampToSeconds } from "../../utils/timestamp";
import { cleanDescription } from "../../utils/cleanDescription";
import { TimestampRegex } from "../../utils/parseChapters";

const regex = new RegExp("(" + [
    "\n",
    "<b>.+<\/b>",
    "[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}",
    "[0-9]{1,2}:[0-9]{1,2}",
].join("|") + ")");

const boldRegex = /(<b>)(.+)(<\/b>)/g;

const parts = {
    newLine: () => (
        <br />
    ),
    text: (v) => (
        <Text span>
            {v}
        </Text>
    ),
    bold: (v) => (
        <Text span fw="bold">
            {v}
        </Text>
    ),
    timestamp: (v) => (
        <TimestampButton
            time={timestampToSeconds(v)}
        />
    ),
};

export const MarkdownText = ({
    text,
}: {
    text: string;
}) => {
    let elements = useMemo(() => {
        let clean = cleanDescription(text);

        let list = clean.split(regex);

        return list
            .filter(x => x)
            .map(item => {
                if(item == "\n") return parts.newLine();
                if(TimestampRegex.test(item)) return parts.timestamp(item);
                if(boldRegex.test(item)) return parts.bold(item);

                return parts.text(item);
            });
    }, [text]);

    return (
        <Box>
            {elements.map((el, i) => (
                <span key={i}>
                    {el}
                </span>
            ))}
        </Box>
    );
};
