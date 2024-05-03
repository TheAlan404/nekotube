import { Text, TextProps, Tooltip } from "@mantine/core";

export const ViewCountCard = ({
    viewCount,
    size,
}: {
    viewCount: number;
    size?: TextProps["fz"];
}) => {
    let text = new Intl.NumberFormat("en", { notation: "compact" })
        .format(viewCount);

    let full = new Intl.NumberFormat("en")
        .format(viewCount);

    return (
        <Tooltip label={`${full} views`}>
            <Text fz={size || "xs"} c="dimmed">
                {text} views
            </Text>
        </Tooltip>
    );
};
