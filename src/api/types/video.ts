import { VideoFormat } from "./format";

export type SearchSuggestions = string[];

export interface Channel {
    id: string;
    title: string;
    thumbnails: Thumbnail[];
};

export interface VideoInfo {
    id: string;
    title: string;
    description: string;
    thumbnails: Thumbnail[];
    channel: Channel;
};

export interface VideoData extends VideoInfo {
    chapters: Chapter[];
    published: Date;
    keywords: string[];
    likeCount?: number;
    viewCount?: number;
    formats: VideoFormat[];

    recommended: Renderer[];
};

export interface Chapter {
    time: number;
    label: string;
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
