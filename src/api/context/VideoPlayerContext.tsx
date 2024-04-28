import { createContext } from "react";
import { Chapter, VideoFormat, VideoInfo } from "../types/video";

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

    videoInfo?: VideoInfo;
    activeChapters: ActiveChapterList;
    setActiveChapters: (source: ActiveChapterList["type"], chapters?: Chapter[]) => void;

    activeFormat?: VideoFormat;
    availableFormats: VideoFormat[];
    setFormat: (fmt: VideoFormat) => void;

    playState: PlayState;
    errorMessage?: string;
    togglePlay: () => void;
    volume: number;
    muted: boolean;
    setVolume: (v: number) => void;
    setMuted: (m: boolean) => void;

    seekTo: (ts: number) => void;
};

// @ts-ignore
export const VideoPlayerContext = createContext<VideoPlayerAPI>();
