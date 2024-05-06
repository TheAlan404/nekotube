import { Box, Text } from "@mantine/core";
import { useMemo } from "react";
import { TimestampButton } from "./TimestampButton";
import { cleanDescription } from "../../utils/cleanDescription";
import { ExternalLink } from "./ExternalLink";

export const MarkdownText = ({
    text,
}: {
    text: string;
}) => {
    let elements = useMemo(() => {
        let parts = cleanDescription(text);

        return parts
            .map(part => {
                if(part.type == "newline") return (
                    <br />
                );

                if(part.type == "timestamp") return (
                    <TimestampButton
                        time={part.time}
                    />
                );

                if(part.type == "link") return (
                    <ExternalLink
                        link={part.href}
                        text={part.href}
                    />
                );

                return (
                    <Text
                        span
                        fw={part.bold ? "bold" : undefined}
                        fz="sm"
                    >
                        {part.data}
                    </Text>
                );
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
