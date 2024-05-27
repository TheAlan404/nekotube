import { useContext, useEffect, useRef, useState } from "react";
import { VideoPlayerContext } from "../../api/player/VideoPlayerContext"
import { Box, Stack, Transition } from "@mantine/core";
import { useDebouncedCallback, useHotkeys, useHover, useMergedRef } from "@mantine/hooks";
import { usePreference } from "../../api/pref/Preferences";
import { PlayerLayoutTop } from "./layout/LayoutTop";
import { PlayerLayoutMiddle } from "./layout/LayoutMiddle";
import { PlayerLayoutBottom } from "./layout/LayoutBottom";
import { useIsMobile } from "../../hooks/useIsMobile";

export const VideoPlayer = () => {
    const isMobile = useIsMobile();
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
    const containerRef = useRef<HTMLDivElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const keepControlsShown = usePreference("keepControlsShown");
    const { hovered, ref } = useHover();
    const [showControls, setShowControls] = useState(true);

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

    const hideCallback = useDebouncedCallback(() => {
        setShowControls(false);
    }, 2000);

    useEffect(() => {
        setShowControls(true);
        hideCallback();
    }, [playState]);

    const shouldShowControls = (
        keepControlsShown
        || showControls
        || hovered
        || !!autoplayDate
        || (playState == "error")
        || (playState == "loading")
    );

    return (
        <Box
            w="100%"
            h="100%"
            className="videoPlayer clickListener"
            style={{ position: "relative" }}
            ref={containerRef}
            onMouseMove={(e) => {
                let xPer = e.clientX / containerRef.current.getBoundingClientRect().width;
                let threshold = 0.01;
                if(xPer < threshold || xPer > (1 - threshold)) return;
                setShowControls(true);
                hideCallback();
            }}
            onClick={(e) => {
                if(!e.currentTarget.classList.contains("clickListener")) return;
                if(isMobile && !shouldShowControls) {
                    setShowControls(true);
                    hideCallback();
                    return;
                }
                let xPer = e.clientX / containerRef.current.getBoundingClientRect().width;
                if(xPer == 0 || xPer == 1) return;
                togglePlay();
            }}
        >
            <Box
                bg="dark.9"
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: "-100",
                }}
                ref={videoContainerRef}
            />
            <Transition
                mounted={shouldShowControls}
                keepMounted
            >
                {(styles) => (
                    <Stack
                        w="100%"
                        h="100%"
                        justify="space-between"
                        style={{
                            ...styles,
                            background: "linear-gradient(to bottom, #000000FF, #00000000 3em), linear-gradient(to top, #000000FF 0%, #00000000 5em)",
                        }}
                        className="clickListener"
                    >
                        <PlayerLayoutTop />
                        <PlayerLayoutMiddle />
                        <div ref={ref}>
                            <PlayerLayoutBottom />
                        </div>
                    </Stack>
                )}
            </Transition>
        </Box>
    );
};
