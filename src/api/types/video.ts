export type SearchSuggestions = string[];

export interface Channel {
    id: string;
    title: string;
};

export interface VideoInfo {
    id: string;
    title: string;
    description: string;
    published: Date;
    channel: Channel;
    keywords: string[];
    likeCount?: number;
    viewCount?: number;
};

export interface VideoFormat {
    itag: string;
    bitrate: number;
    fps: number;
    width: number;
    height: number;
    mimeType: string;
    url: string;
};

export interface Caption {
    vssId: string;
    languageCode: string;
    label: string;
    url: string;
    isAutomatic?: boolean;
};
