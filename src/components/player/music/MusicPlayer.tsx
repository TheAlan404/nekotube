import { useContext, useEffect, useRef, useState } from "react";
import { VideoPlayerContext } from "../../../api/player/VideoPlayerContext"
import { Box, Stack, Transition } from "@mantine/core";
import { useDebouncedCallback, useHotkeys, useHover, useMergedRef } from "@mantine/hooks";
import { usePreference } from "../../../api/pref/Preferences";
import { MusicControls } from "./MusicControls";
import { useIsMobile } from "../../../hooks/useIsMobile";

export const MusicPlayer = () => {
    const {
        videoElement,
        seekToChapterOffset,
        seekTo,
        togglePlay,
        playState,
        muted,
        setMuted,
        autoplayDate,
    } = useContext(VideoPlayerContext);
    const videoContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        videoContainerRef.current?.appendChild(videoElement);
        if(videoElement.paused && videoElement.currentSrc && videoElement.currentTime)
            videoElement.play();
        return () => {
            videoElement.pause();
        };
    }, [videoElement, videoContainerRef.current]);

    useHotkeys([
        ["ArrowLeft", () => seekTo(videoElement.currentTime - 5)],
        ["ArrowRight", () => seekTo(videoElement.currentTime + 5)],
        ["Shift + ArrowRight", () => seekToChapterOffset(1)],
        ["Shift + ArrowLeft", () => seekToChapterOffset(-1)],
        ["J", () => seekTo(videoElement.currentTime - 10)],
        ["L", () => seekTo(videoElement.currentTime + 10)],
        ["K", () => togglePlay()],
        ["Space", () => togglePlay()],
        ["m", () => setMuted(!muted)],
        ["0", () => seekTo(0)],
    ]);
    return (
        <Box
            w="100%"
            h="100%"
            style={{ position: "relative" }}
        >
            <Box
                bg="dark.9"
                style={{
                    position: "absolute",
                    height: "0%",
                    width: "0%",
                    zIndex: "-100",
                }}
                ref={videoContainerRef}
            />
            <MusicControls />
        </Box>
    );
};
