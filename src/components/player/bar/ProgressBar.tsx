import { useContext, useEffect, useMemo, useState } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { useVideoEventListener } from "../../../hooks/useVideoEventListener";
import { Group } from "@mantine/core";
import { calculateSegments, Segment } from "./segments";

export const ProgressBar = () => {
    const { videoElement, activeChapters } = useContext(VideoPlayerContext);
    const [segments, setSegments] = useState<Segment[]>([
        {
            start: 0,
            end: 100,
            value: 100,
            label: "",
        }
    ]);

    useVideoEventListener(videoElement, "timeupdate", () => {
        setSegments(calculateSegments({
            chapters: activeChapters.chapters,
            duration: videoElement.duration,
            progress: videoElement.currentTime,
        }));
    });

    useEffect(() => {
        setSegments(calculateSegments({
            chapters: activeChapters.chapters,
            duration: videoElement.duration,
            progress: videoElement.currentTime,
        }));
    }, [activeChapters]);

    return (
        <Group align="center" w="100%">
            <Group gap={4} wrap="nowrap" w="100%" h="0.4em">
                {segments.map((segment, i) => (
                    <div
                        key={i}
                        className="progressbar-outer"
                        style={{
                            left: `calc(${segment.start}% + 1px)`,
                            width: `calc(${segment.end}% - 2px)`,
                        }}
                    >
                        <div
                            className="progressbar-inner"
                            style={{ width: segment.value + "%" }}
                            data-playing={segment.value < 100}
                        />
                    </div>
                ))}
            </Group>
        </Group>
    );
};
