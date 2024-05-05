import { AspectRatio, Box, Flex, Image, Loader, Text } from "@mantine/core";
import { Thumbnail } from "../../api/types/video";
import { secondsToTimestamp } from "../../utils/timestamp";

export const ThumbnailRender = ({
    thumbnails,
    fallback,
    length,
    loading,
}: {
    thumbnails: Thumbnail[],
    fallback?: string,
    length?: number,
    loading?: boolean,
}) => {
    const scale = 0.5;
    return (
        <AspectRatio ratio={16/9} w={(16 * scale) + "em"} h={(9 * scale) + "em"}>
            <Image
                src={thumbnails[thumbnails.length-1]?.url}
                fallbackSrc={fallback}
                loading="lazy"
            />
            <Flex w="100%" h="100%" align="end" justify="end">
                {length && (
                    <Text
                        bg="dark"
                        style={{ borderRadius: "var(--mantine-radius-sm)" }}
                        px={2}
                        fz="xs"
                        m={2}
                    >
                        {secondsToTimestamp(length)}
                    </Text>
                )}
                {loading && (
                    <Loader size="xs" />
                )}
            </Flex>
        </AspectRatio>
    );
};
