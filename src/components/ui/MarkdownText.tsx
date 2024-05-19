import { Box, Button, Text } from "@mantine/core";
import { useMemo } from "react";
import { TimestampButton } from "./TimestampButton";
import { parseFormattedText } from "../../utils/parseFormattedText";
import { ExternalLink } from "./ExternalLink";

export const MarkdownText = ({
    text,
}: {
    text: string;
}) => {
    let elements = useMemo(() => {
        let parts = parseFormattedText(text);

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
                    />
                );

                if(part.type == "hashtag") return (
                    <Text c="blue">
                        #{part.data}
                    </Text>
                );

                if(part.type == "channel") return (
                    <Button
                        color="dark"
                        variant="light"
                        size="compact-sm"
                    >
                        {part.id}
                    </Button>
                );

                if(part.type == "videoLink") return (
                    <Button
                        color="dark"
                        variant="light"
                        size="compact-sm"
                    >
                        {part.id}
                    </Button>
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
        <Box w="100%">
            {elements.map((el, i) => (
                <span key={i}>
                    {el}
                </span>
            ))}
        </Box>
    );
};
