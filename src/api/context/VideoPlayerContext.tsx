import { createContext } from "react";
import { Chapter, VideoData } from "../types/video";
import { VideoFormat } from "../types/format";

export type PlayState = "loading" | "playing" | "paused" | "error";

export type ActiveChapterList = {
    type: "video" | "user";
    chapters: Chapter[];
} | {
    type: "comment";
    chapters: Chapter[];
    id: string;
};

export interface VideoPlayerAPI {
    videoElement: HTMLVideoElement;

    videoID?: string;
    setVideoID: (id?: string) => void;
    fetchVideoInfo: () => void;

    videoInfo?: VideoData;
    activeChapters: ActiveChapterList;
    setActiveChapters: (source: ActiveChapterList["type"], chapters?: Chapter[], id?: string) => void;

    activeFormat?: VideoFormat;
    availableFormats: VideoFormat[];
    setFormat: (id: string) => void;

    playState: PlayState;
    error?: any;
    togglePlay: () => void;
    volume: number;
    muted: boolean;
    setVolume: (v: number) => void;
    setMuted: (m: boolean) => void;

    seekTo: (ts: number) => void;
    seekToChapterOffset: (offset: number) => void;
};

// @ts-ignore
export const VideoPlayerContext = createContext<VideoPlayerAPI>();
