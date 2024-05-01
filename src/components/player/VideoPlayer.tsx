import { useContext, useEffect, useRef, useState } from "react";
import { VideoPlayerContext } from "../../api/context/VideoPlayerContext"
import { Box, Button, Drawer, Group, Loader, ScrollArea, Stack, Text, Title, Transition } from "@mantine/core";
import { PlayPauseButton } from "./controls/PlayPauseButton";
import { PlayerTimestamp } from "./controls/PlayerTimestamp";
import { VolumeControls } from "./controls/VolumeControls";
import { ProgressBar } from "./bar/ProgressBar";
import { useDisclosure, useDocumentTitle, useFullscreen, useHotkeys, useHover, useMergedRef } from "@mantine/hooks";
import { IconAlertTriangle, IconReload } from "@tabler/icons-react";
import { FullscreenButton } from "./controls/FullscreenButton";
import { OptionsButton } from "../options/OptionsButton";
import { useSoundEffect } from "../../hooks/useSoundEffect";
import { usePreference } from "../../api/pref/Preferences";
import { ErrorMessage } from "../ui/ErrorMessage";

export const VideoPlayer = () => {
    const { videoElement, setVideoID, videoInfo, seekTo, togglePlay, playState, muted, setMuted, error, fetchVideoInfo } = useContext(VideoPlayerContext);
    const containerRef = useRef<HTMLDivElement>(null);
    const { ref: fullscreenRef, fullscreen, toggle: toggleFullscreen } = useFullscreen();
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
        ["J", () => seekTo(videoElement.currentTime - 10)],
        ["L", () => seekTo(videoElement.currentTime + 10)],
        ["K", () => togglePlay()],
        ["Space", () => togglePlay()],
        ["m", () => setMuted(!muted)],
    ]);

    useDocumentTitle(videoInfo ? (
        (playState == "paused" ? "⏸︎ " : (muted ? "🔇 " : "")) + videoInfo.title + " - NekoTube"
    ) : "NekoTube");

    const mergedRef = useMergedRef(
        hoverRef,
        fullscreenRef,
    );

    const shouldShowControls = playState !== "error";

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
                mounted={keepControlsShown || hovered || (playState == "error")}
                keepMounted
            >
                {(styles) => (
                    <Stack
                        w="100%"
                        h="100%"
                        justify="space-between"
                        style={styles}
                        className="clickListener"
                        onClick={(e) => e.currentTarget.classList.contains("clickListener") && togglePlay()}
                    >
                        <Stack
                            p="xs"
                            style={{
                                background: "linear-gradient(to bottom, #000000AA, #00000000)",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Group align="center" px="sm">
                                {playState == "loading" && (
                                    <Loader size="sm" />
                                )}
                                {playState == "error" && (
                                    <IconAlertTriangle />
                                )}
                                <Stack gap={0}>
                                    <Title order={4}>
                                        {!videoInfo ? (
                                            playState == "error" ? "Error" : "Loading..."
                                        ) : (
                                            videoInfo?.title || "Loading..."
                                        )}
                                    </Title>
                                    <Text c="dimmed">
                                        {playState == "error" && (
                                            videoInfo ? "playback error" : "error while fetching details"
                                        )}
                                        {playState == "loading" && (
                                            videoInfo ? "starting playback..." : "fetching video info..."
                                        )}
                                    </Text>
                                </Stack>
                            </Group>
                        </Stack>
                        <Stack w="100%" align="center">
                            {playState == "loading" && (
                                <Box p="md" bg="dark" style={{ opacity: 0.9, borderRadius: "var(--mantine-radius-md)" }}>
                                    <Loader />
                                </Box>
                            )}
                            {playState == "error" && (
                                <Stack w="100%" bg="dark" py="md">
                                    <ErrorMessage
                                        error={error}
                                        retry={fetchVideoInfo}
                                    />
                                </Stack>
                            )}
                        </Stack>
                        <Stack
                            gap="xs"
                            p="xs"
                            w="100%"
                            style={{
                                background: "linear-gradient(to top, #000000AA, #00000000)",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ProgressBar />

                            <Group justify="space-between">
                                <Group>
                                    <PlayPauseButton />
                                    <VolumeControls />
                                    <PlayerTimestamp />
                                </Group>
                                <Group>
                                    <OptionsButton />
                                    <FullscreenButton
                                        {...{
                                            fullscreen,
                                            toggleFullscreen,
                                        }}
                                    />
                                </Group>
                            </Group>
                        </Stack>
                    </Stack>
                )}
            </Transition>
        </Box>
    );
};
