import { AspectRatio, Image } from "@mantine/core";
import { Thumbnail } from "../../api/types/video";

export const ThumbnailRender = ({
    thumbnails,
}: {
    thumbnails: Thumbnail[],
}) => {
    return (
        <AspectRatio ratio={16/9}>
            <Image
                src={thumbnails[thumbnails.length-1].url}
            />
        </AspectRatio>
    );
};
