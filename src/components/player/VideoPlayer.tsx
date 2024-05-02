import { useContext, useEffect, useRef } from "react";
import { VideoPlayerContext } from "../../api/context/VideoPlayerContext"
import { Box, Stack, Transition } from "@mantine/core";
import { useHotkeys, useHover, useMergedRef } from "@mantine/hooks";
import { usePreference } from "../../api/pref/Preferences";
import { LayoutTop } from "./layout/LayoutTop";
import { LayoutMiddle } from "./layout/LayoutMiddle";
import { LayoutBottom } from "./layout/LayoutBottom";

export const VideoPlayer = () => {
    const { videoElement, seekToChapterOffset, videoInfo, seekTo, togglePlay, playState, muted, setMuted, error, fetchVideoInfo } = useContext(VideoPlayerContext);
    const containerRef = useRef<HTMLDivElement>(null);
    const keepControlsShown = usePreference("keepControlsShown");
    const { ref: hoverRef, hovered } = useHover();

    // -- binding --

    useEffect(() => {
        containerRef.current?.appendChild(videoElement);
        return () => {
            videoElement.pause();
        };
    }, [videoElement, containerRef.current]);

    // -- hotkeys --

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
    ]);

    const mergedRef = useMergedRef(
        hoverRef
    );

    const shouldShowControls = keepControlsShown || hovered || (playState == "error") || (playState == "loading");

    return (
        <Box w="100%" h="100%" className="videoPlayer" style={{ position: "relative" }} ref={mergedRef}>
            <Box
                bg="dark.9"
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: "-100",
                }}
                ref={containerRef}
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
                        onClick={(e) => e.currentTarget.classList.contains("clickListener") && togglePlay()}
                    >
                        <LayoutTop />
                        <LayoutMiddle />
                        <LayoutBottom />
                    </Stack>
                )}
            </Transition>
        </Box>
    );
};
