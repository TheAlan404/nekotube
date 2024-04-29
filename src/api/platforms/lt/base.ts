import { Thumbnail } from "../../types/video";

export interface LTChannel {
    id: string;
    title: string;
    avatar?: string;
    subscribers?: string;
    badges: any[];
}

export interface LTVideoResponse {
    id: string;
    title: string;
    description: string;
    dateText: string;
    viewCount: string;
    likeCount: string;
    channel: LTChannel;
    commentsContinuation: string;
    commentCount: string;
    recommended: any[];
}

export interface LTPlayerDetails {
    id: string;
    title: string;
    author: LTChannel;
    keywords: string[];
    shortDescription: string;
    category?: string;
    publishDate: string;
    uploadDate: string;
    length: string;
    isLive: boolean;
    allowRatings: boolean;
    isFamilySafe: boolean;
    thumbnails: Thumbnail[];
}

export interface LTFormat {
    itag: string;
    bitrate: number;
    fps: number;
    width: number;
    height: number;
    mimeType: string;
    url: string;
    quality: string;
    qualityLabel: string;
    audioQuality: string;
    audioSampleRate: number;
    audioChannels: number;
    audioTrack?: string;
};
