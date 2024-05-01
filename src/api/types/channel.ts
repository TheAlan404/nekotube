import { Thumbnail } from "./video";

export interface Channel {
    id: string;
    title: string;
    thumbnails: Thumbnail[];
}
