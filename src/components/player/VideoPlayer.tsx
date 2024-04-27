import { useContext, useEffect, useRef } from "react";
import { VideoPlayerContext } from "../../api/context/VideoPlayerContext"
import { Box, Group, Stack, Title, Transition } from "@mantine/core";
import { PlayPauseButton } from "./controls/PlayPauseButton";
import { PlayerTimestamp } from "./controls/PlayerTimestamp";
import { VolumeControls } from "./controls/VolumeControls";
import { ProgressBar } from "./bar/ProgressBar";
import { useDocumentTitle, useHotkeys, useHover } from "@mantine/hooks";

export const VideoPlayer = () => {
    const { videoElement, setVideoID, videoInfo, seekTo, togglePlay, playState, muted } = useContext(VideoPlayerContext);
    const containerRef = useRef<HTMLDivElement>(null);
    const { ref: hoverRef, hovered } = useHover();

    useEffect(() => {
        containerRef.current?.appendChild(videoElement);

        //setVideoID("FtutLA63Cp8");
        setVideoID("4Bz0pYhAoFg");
    }, [videoElement, containerRef.current]);

    useHotkeys([
        ["ArrowLeft", () => seekTo(videoElement.currentTime - 5)],
        ["ArrowRight", () => seekTo(videoElement.currentTime + 5)],
        ["J", () => seekTo(videoElement.currentTime - 10)],
        ["L", () => seekTo(videoElement.currentTime + 10)],
        ["K", () => togglePlay()],
        ["Space", () => togglePlay()],
    ]);

    useDocumentTitle((playState == "paused" ? "⏸︎ " : (muted ? "🔇 " : "")) + videoInfo.title + " - NekoTube");

    return (
        <Box w="100%" h="100%" className="videoPlayer" style={{ position: "relative" }} ref={hoverRef}>
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
                mounted={true}
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
                            <Title order={4}>
                                {videoInfo?.title || "Loading..."}
                            </Title>
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
                                meow
                            </Group>
                        </Stack>
                    </Stack>
                )}
            </Transition>
        </Box>
    );
};
