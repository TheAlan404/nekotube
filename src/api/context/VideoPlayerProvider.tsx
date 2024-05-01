import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ActiveChapterList, PlayState, VideoPlayerContext } from "./VideoPlayerContext";
import { APIContext } from "./APIController";
import { VideoData } from "../types/video";
import { VideoFormat } from "../types/format";
import { useVideoEventListener } from "../../hooks/useVideoEventListener";
import { parseChapters } from "../../utils/parseChapters";
import { clamp } from "@mantine/hooks";

export const VideoPlayerProvider = ({
    children
}: React.PropsWithChildren) => {
    //const sourceElement = useRef<HTMLSourceElement>(null);
    const videoElement = useMemo(() => {
        let el = document.createElement("video");
        el.style.width = "100%";
        el.style.height = "100%";
        return el;
    }, []);
    const { api, currentInstance } = useContext(APIContext);

    const [videoID, setVideoID] = useState<string | null>(null);
    const [videoInfo, setVideoInfo] = useState<VideoData | null>(null);
    const [activeChapters, setActiveChapters] = useState<ActiveChapterList>({
        type: "video",
        chapters: [],
    });
    const [activeFormat, setActiveFormat] = useState<VideoFormat | null>(null);
    const [availableFormats, setAvailableFormats] = useState<VideoFormat[]>([]);
    const [playState, setPlayState] = useState<PlayState>("loading");
    const [error, setError] = useState<any | null>(null);
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

    const fetchVideoInfo = async () => {
        setPlayState("loading");
        setAvailableFormats([]);
        setActiveFormat(null);
        setVideoInfo(null);
        setActiveChapters({
            chapters: [],
            type: "video",
        });
        if(!videoID) return;
        
        try {
            let info = await api.getVideoInfo(videoID);
            setVideoInfo(info);

            console.log("Fetched VideoData", info);

            let chapters = parseChapters(info.description);
            setActiveChapters({
                type: "video",
                chapters,
            });
            console.log("Chapters from description:", chapters);
        } catch(e) {
            console.log(e);
            setError(e);
            setPlayState("error");
        }
    };

    useEffect(() => {
        fetchVideoInfo();
    }, [currentInstance, videoID]);

    useEffect(() => {
        if(!videoInfo) return;

        setAvailableFormats(videoInfo.formats);
        setActiveFormat(videoInfo.formats
            .filter(f => f.type == "basic")
            .filter(f => currentInstance.type != "invidious" || f.isProxied)
            .findLast(x=>x)
        );
    }, [videoInfo]);

    useEffect(() => {
        console.log("Setting URL to", activeFormat?.url);
        if(videoElement.src != activeFormat?.url) videoElement.src = activeFormat?.url;
    }, [activeFormat]);

    useVideoEventListener(videoElement, "ended", () => {
        setPlayState("paused");
    });

    useVideoEventListener(videoElement, "loadeddata", () => {
        videoElement.play()
    });

    useVideoEventListener(videoElement, "error", (e) => {
        if(!videoElement.src || videoElement.src.endsWith("/undefined")) return;
        setPlayState("error");
        console.log(e.error);
        console.log(videoElement.error);
        setError(e.error || new Error(videoElement.error.message));
    });

    useVideoEventListener(videoElement, "pause", () => {
        setPlayState("paused");
    });

    useVideoEventListener(videoElement, "play", () => {
        setPlayState("playing");
    });

    const seekTo = (ts: number) => {
        videoElement.currentTime = clamp(0, ts, videoElement.duration);
    };

    const seekToChapterOffset = (offset: number = 0) => {
        let currentChapterIndex = activeChapters.chapters.findIndex(c => c.time > videoElement.currentTime) - 1;
        let currentChapter = activeChapters.chapters[currentChapterIndex];
        if(!currentChapter) {
            if(offset == 1) videoElement.fastSeek(videoElement.duration);
            return;
        }
        let chapterProgress = videoElement.currentTime - currentChapter.time;
        let targetIndex = currentChapterIndex + offset;
        if(offset == -1) {
            if(chapterProgress > 3) targetIndex++;
        }
        let target = activeChapters.chapters[targetIndex];
        
        videoElement.fastSeek(clamp(0, target?.time || 0, videoElement.duration));
    }

    return (
        <VideoPlayerContext.Provider value={{
            videoElement,

            videoID,
            setVideoID: (id) => setVideoID(id),
            videoInfo,
            fetchVideoInfo,

            activeFormat,
            availableFormats,
            setFormat: (id: string) => {
                setActiveFormat(availableFormats.find(f => f.id == id)!);
            },

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
            error,
            togglePlay() {
                if(playState == "loading") return;
                if(playState == "playing" && !videoElement.paused) {
                    videoElement.pause();
                } else if(playState == "paused" && videoElement.paused) {
                    videoElement.play()
                        .catch((e) => {
                            if(e instanceof DOMException && e.code == 20) {
                                videoElement.load();
                            }
        
                            setPlayState("paused");
                        })
                }
            },
            volume,
            setVolume,
            muted,
            setMuted,

            seekTo,
            seekToChapterOffset,
        }}>
            {children}
        </VideoPlayerContext.Provider>
    );
};
