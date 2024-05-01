import { createContext } from "react";
import { Chapter, VideoData } from "../types/video";
import { VideoFormat } from "../types/format";

export type PlayState = "loading" | "playing" | "paused" | "error";

export interface ActiveChapterList {
    type: "video" | "comment" | "user";
    chapters: Chapter[];
};

export interface VideoPlayerAPI {
    videoElement: HTMLVideoElement;

    videoID?: string;
    setVideoID: (id?: string) => void;
    fetchVideoInfo: () => void;

    videoInfo?: VideoData;
    activeChapters: ActiveChapterList;
    setActiveChapters: (source: ActiveChapterList["type"], chapters?: Chapter[]) => void;

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
