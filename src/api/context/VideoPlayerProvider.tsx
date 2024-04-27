import { useContext, useEffect, useMemo, useState } from "react";
import { ActiveChapterList, PlayState, VideoPlayerContext } from "./VideoPlayerContext";
import { APIContext } from "./APIController";
import { VideoInfo } from "../types/video";
import { useVideoEventListener } from "../../hooks/useVideoEventListener";
import { parseChapters } from "../../utils/parseChapters";
import { clamp } from "@mantine/hooks";

export const VideoPlayerProvider = ({
    children
}: React.PropsWithChildren) => {
    const videoElement = useMemo(() => {
        let el = document.createElement("video");
        el.style.width = "100%";
        el.style.height = "100%";
        return el;
    }, []);
    const { api, currentInstance } = useContext(APIContext);

    const [videoID, setVideoID] = useState<string | null>(null);
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [activeChapters, setActiveChapters] = useState<ActiveChapterList>({
        type: "video",
        chapters: [],
    });
    const [playState, setPlayState] = useState<PlayState>("loading");
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        return () => {
            videoElement.pause();
            videoElement.remove();
        };
    }, []);

    useEffect(() => {
        videoElement.muted = muted;
    }, [muted]);

    useEffect(() => {
        videoElement.volume = volume;
    }, [volume]);

    useEffect(() => {
        if(playState == "playing" && videoElement.paused) {
            videoElement.play()
                .catch((e) => {
                    if(e instanceof DOMException && e.code == 20) {
                        videoElement.load();
                    }

                    setPlayState("paused");
                })
        } else if(playState == "paused" && !videoElement.paused) {
            videoElement.pause();
        }
    }, [playState]);

    useEffect(() => {
        (async () => {
            if(!videoID) return setVideoInfo(null);
            let info = await api.getVideoInfo(videoID);
            console.log("VideoInfo", info);
            setVideoInfo(info);

            let chapters = parseChapters(info.description);
            console.log("Chapters", chapters);
            setActiveChapters({
                type: "video",
                chapters,
            });
        })()
    }, [currentInstance, videoID]);

    useEffect(() => {
        if(!videoInfo) return;
        let fmt = videoInfo.formats.find(f => f.url);
        videoElement.src = fmt.url;
    }, [videoInfo]);

    useVideoEventListener(videoElement, "timeupdate", () => {

    });

    useVideoEventListener(videoElement, "error", (e) => {

    });

    useVideoEventListener(videoElement, "ended", () => {
        setPlayState("paused");
    });

    useVideoEventListener(videoElement, "canplay", () => {
        setPlayState("paused");
    });

    return (
        <VideoPlayerContext.Provider value={{
            videoElement,

            videoID,
            setVideoID: (id) => setVideoID(id),
            videoInfo,

            activeChapters,
            setActiveChapters: (source, chapters = []) => {
                if(source == "video") {
                    setActiveChapters({
                        type: "video",
                        chapters: parseChapters(videoInfo?.description || ""),
                    });
                } else {
                    setActiveChapters({
                        type: source,
                        chapters,
                    });
                }
            },

            playState,
            togglePlay() {
                setPlayState(s => s == "paused" ? "playing" : (s == "playing" ? "paused" : s));
            },
            volume,
            setVolume,
            muted,
            setMuted,

            seekTo: (ts: number) => {
                videoElement.currentTime = clamp(0, ts, videoElement.duration);
            },
        }}>
            {children}
        </VideoPlayerContext.Provider>
    );
};
