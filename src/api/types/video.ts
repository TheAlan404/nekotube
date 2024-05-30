import { Channel } from "./channel";
import { Chapter } from "./chapter";
import { VideoFormat } from "./format";

export type SearchSuggestions = string[];

export interface VideoInfo {
    id: string;
    title: string;
    description: string;
    thumbnails: Thumbnail[];
    published?: Date;
    viewCount?: number;
    likeCount?: number;
    dislikeCount?: number;
    length?: number;
    channel: Channel;
};

export interface VideoData extends VideoInfo {
    chapters: Chapter[];
    keywords: string[];
    formats: VideoFormat[];

    recommended: Renderer[];
};

export interface Caption {
    vssId: string;
    languageCode: string;
    label: string;
    url: string;
    isAutomatic?: boolean;
};

export interface Thumbnail {
    url: string;
    width: number;
    height: number;
};

export interface PlaylistInfo {
    
};

export type Renderer = ({ type: "video" } & VideoInfo);
