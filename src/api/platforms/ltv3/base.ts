import { Thumbnail } from "../../types/video";
import { LTRenderer } from "./renderers";

export interface LTChannel {
    id: string;
    title: string;
    handle?: string;
    avatar?: Thumbnail[];
    subscribersText?: string;
    subscribers?: number;
    badges: any[];
}

export interface LTVideoResponse {
    id: string;
    title: string;
    description: string;
    dateText: string;
    publishType: number;
    publishDate: string;
    viewCount: number;
    viewCountText: string;
    likeCount: number;
    likeCountText: string;
    channel: LTChannel;
    commentsContinuation: string;
    commentsCount: number;
    commentsCountText: string;
    commentsErrorMessage?: string;
    recommended: LTRenderer[];
    playlist?: any;
    chapters: any[];
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
    mime: string;
    url: string;
    contentLength: number;
    lastModified: number;
    qualityLabel: string;
    audioQuality: string;
    audioSampleRate: number;
    audioChannels: number;
    audioTrack?: string;
};

export interface LTStoryboards {
    recommendedLevel: number;
    levels: string[];
}

export interface LTCaption {
    vssId: string;
    languageCode: string;
    label: string;
    baseUrl: string;
    isAutomaticCaption?: boolean;
}
