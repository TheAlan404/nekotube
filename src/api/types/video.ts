export type SearchSuggestions = string[];

export interface Channel {
    id: string;
    title: string;
};

export interface VideoData {
    id: string;
    title: string;
    description: string;
    chapters: Chapter[];
    published: Date;
    channel: Channel;
    keywords: string[];
    likeCount?: number;
    viewCount?: number;
    formats: VideoFormat[];
};

export interface VideoFormat {
    itag: string;
    url: string;
    mimeType: string;
    bitrate: number;
    fps: number;
    width: number;
    height: number;
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

export type SearchResult = ({ type: "video" } & VideoInfo);

export interface VideoInfo {
    id: string;
    title: string;
    shortDescription: string;
    thumbnails: Thumbnail[];
    channel: Channel;
};

export interface PlaylistInfo {

};
