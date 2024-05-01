import { AspectRatio, Image } from "@mantine/core";
import { Thumbnail } from "../../api/types/video";

export const ThumbnailRender = ({
    thumbnails,
    fallback,
}: {
    thumbnails: Thumbnail[],
    fallback?: string,
}) => {
    const scale = 0.5;
    return (
        <AspectRatio ratio={16/9} w={(16 * scale) + "em"} h={(9 * scale) + "em"}>
            <Image
                src={thumbnails[thumbnails.length-1]?.url}
                fallbackSrc={fallback}
                loading="lazy"
            />
        </AspectRatio>
    );
};
