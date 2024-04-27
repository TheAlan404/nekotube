import { createContext } from "react";

export type PlayState = "loading" | "playing" | "paused";

export interface VideoPlayerAPI {
    videoElement: HTMLVideoElement;

    videoID: string | null;
    setVideoID: (id: string | null) => void;

    playState: PlayState;
    togglePlay: () => void;
    volume: number;
    muted: boolean;
    setVolume: (v: number) => void;
    setMuted: (m: boolean) => void;
};

// @ts-ignore
export const VideoPlayerContext = createContext<VideoPlayerAPI>();
