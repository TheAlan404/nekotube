import { Thumbnail } from "../../types/video";
import { LTChannel } from "./base";

export interface LTVideoRenderer {
    type: "videoRenderer";
    id: string;
    title: string;
    description: string;
    duration: string;
    published: string;
    viewCount: string;
    thumbnails: Thumbnail[];
    channel: LTChannel;
};

export interface LTShelfRenderer {
    type: "shelfRenderer";
    title: string;
    subtitle?: string;
    destination?: string;
    collapsedItemCount: number;
    direction: number;
    items: LTRenderer[];
};

export interface LTHorizontalCardListRenderer {
    type: "horizontalCardListRenderer";
    title: string;
    items: {
        type: "searchRefinementCardRenderer",
        title: string;
        thumbnails: Thumbnail[];
    }[];
};

export interface LTReelShelfRenderer {
    type: "reelShelfRenderer";
    title: string;
    items: {
        type: "reelItemRenderer";
        id: string;
        title: string;
        viewCount: string;
        thumbnails: Thumbnail[];
    }[];
};

export interface LTRadioRenderer {
    type: "radioRenderer";
    id: string;
    title: string;
    thumbnails: Thumbnail[];
    firstVideoId: string;
};

export type LTRenderer = LTVideoRenderer
    | LTRadioRenderer
    | LTShelfRenderer
    | LTReelShelfRenderer
    | LTHorizontalCardListRenderer

