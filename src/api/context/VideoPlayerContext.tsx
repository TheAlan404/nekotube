import { createContext } from "react";
import { Chapter, VideoInfo } from "../types/video";

export type PlayState = "loading" | "playing" | "paused";

export interface ActiveChapterList {
    type: "video" | "comment" | "user";
    chapters: Chapter[];
};

export interface VideoPlayerAPI {
    videoElement: HTMLVideoElement;

    videoID: string | null;
    setVideoID: (id: string | null) => void;

    videoInfo: VideoInfo | null;
    activeChapters: ActiveChapterList;
    setActiveChapters: (source: ActiveChapterList["type"], chapters?: Chapter[]) => void;

    playState: PlayState;
    togglePlay: () => void;
    volume: number;
    muted: boolean;
    setVolume: (v: number) => void;
    setMuted: (m: boolean) => void;

    seekTo: (ts: number) => void;
};

// @ts-ignore
export const VideoPlayerContext = createContext<VideoPlayerAPI>();
