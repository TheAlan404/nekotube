import { useContext, useEffect, useMemo, useState } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { useVideoEventListener } from "../../../hooks/useVideoEventListener";
import { Group } from "@mantine/core";
import { calculateSegments, Segment } from "./segments";
import { useMove } from "@mantine/hooks";
import { getBuffered } from "../../../utils/getBuffered";

export const ProgressBar = () => {
    const { videoElement, activeChapters, seekTo, playState } = useContext(VideoPlayerContext);
    const [segments, setSegments] = useState<Segment[]>([
        {
            position: {
                start: 0,
                end: 100,
            },
            buffered: [],
            progress: 100,
            label: "",
        }
    ]);

    let [playOnScrubEnd, setPlayOnScrubEnd] = useState(false);
    let [seekTarget, setSeekTarget] = useState(0);
    const { ref, active: isScrubbing } = useMove(({ x = 0 }) => {
        setSeekTarget(x * videoElement.duration);
    }, {
        onScrubStart: () => {
            setPlayOnScrubEnd(playState == "playing");
        },
        onScrubEnd: () => {
            seekTo(seekTarget);
            if(playOnScrubEnd) videoElement.play();
        },
    });

    const progress = isScrubbing ? seekTarget : videoElement.currentTime;

    useVideoEventListener(videoElement, "timeupdate", () => {
        setSegments(calculateSegments({
            chapters: activeChapters.chapters,
            duration: videoElement.duration,
            buffered: getBuffered(videoElement.buffered),
            progress,
        }));
    });

    useEffect(() => {
        setSegments(calculateSegments({
            chapters: activeChapters.chapters,
            duration: videoElement.duration,
            buffered: getBuffered(videoElement.buffered),
            progress,
        }));
    }, [activeChapters, isScrubbing ? seekTarget : 0]);

    return (
        <Group align="center" w="100%">
            <Group gap={4} wrap="nowrap" w="100%" h="0.4em" ref={ref}>
                {segments.map((segment, i) => (
                    <div
                        key={i}
                        className="progressbar-outer"
                        style={{
                            left: `calc(${segment.position.start}% + 1px)`,
                            width: `calc(${segment.position.end}% - 2px)`,
                        }}
                    >
                        <div
                            className="progressbar-inner"
                            style={{ width: segment.progress + "%" }}
                            data-playing={segment.progress < 100}
                            data-loading={playState == "loading"}
                        />
                        {segment.buffered.map((buf, i) => (
                            <div
                                className="progressbar-buffer"
                                key={i}
                                style={{
                                    left: buf.start + "%",
                                    width: (buf.end - buf.start) + "%"
                                }}
                            />
                        ))}
                    </div>
                ))}
            </Group>
        </Group>
    );
};
