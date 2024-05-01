import { Channel } from "./Channel";

export interface Comment {
    id: string;
    channel: Channel;
    content: string;
    edited: boolean;
    pinned: boolean;
    hearted: boolean;
    likeCount: number;
    published: Date;
    replyCount: number;
    replyKey?: string;
};
