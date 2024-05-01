import { AspectRatio, Image } from "@mantine/core";
import { Thumbnail } from "../../api/types/video";

export const ThumbnailRender = ({
    thumbnails,
    fallback,
}: {
    thumbnails: Thumbnail[],
    fallback?: string,
}) => {
    return (
        <AspectRatio ratio={16/9} w={(16 / 1.5) + "em"} h={(9 / 1.5) + "em"}>
            <Image
                src={thumbnails[thumbnails.length-1]?.url}
                fallbackSrc={fallback}
            />
        </AspectRatio>
    );
};
