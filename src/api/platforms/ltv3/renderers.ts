import { Thumbnail } from "../../types/video";
import { LTChannel } from "./base";

export interface LTVideo {
    videoId: string;
    title: string;
    thumbnails: Thumbnail[];
    author: LTChannel;
    duration: string;
    publishedText: string;
    relativePublishedDate: string;
    viewCountText: string;
    viewCount: number;
    description: string;
    badges: any[];
};

export interface LTPlaylist {
    playlistId: string;
    title: string;
    thumbnails: Thumbnail[];
    firstVideoId: string;
    videoCount: number;
    videoCountText: string;
    author?: LTChannel;
    childVideos?: any;
    sidebarThumbnails?: ([Thumbnail])[];
};

export interface LTContainer {
    items: LTRenderer[];
    style: string;
    title: string;
    subtitle: string;
    destination?: any;
    shownItemCount: number;
};

export interface LTComment {
    id: string;
    content: string;
    publishedTimeText: string;
    owner: LTChannel;
    loved?: {
        heartedBy: string;
        heartedAvatarUrl: string;
    };
    likeCountText: string;
    replyCountText: string;
    pinned: boolean;
    authorIsChannelOwner: boolean;
    replyContinuation?: string;
};

export type LTRenderer = {
    type: "video";
    originalType: "videoRenderer" | "compactVideoRenderer";
    data: LTVideo;
} | {
    type: "playlist";
    originalType: "radioRenderer" | "compactPlaylistRenderer";
    data: LTPlaylist;
} | {
    type: "container";
    originalType: "shelfRenderer";
    data: LTContainer;
} | {
    type: "continuation";
    originalType: "continuationItemRenderer";
    data: {
        continuationToken: string;
    };
} | {
    type: "unknown";
    originalType: string;
    data: {
        protobufBytes?: any;
        json?: string;
    };
};

