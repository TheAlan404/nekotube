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
        if(!videoID) return;
        
        try {
            let info = await api.getVideoInfo(videoID);
            setVideoInfo(info);

            let chapters = parseChapters(info.description);
            setActiveChapters({
                type: "video",
                chapters,
            });
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
        setActiveFormat(videoInfo.formats[0]);
    }, [videoInfo]);

    useEffect(() => {
        console.log("Setting URL to", activeFormat?.url);
        videoElement.src = activeFormat?.url;
    }, [activeFormat]);

    useVideoEventListener(videoElement, "ended", () => {
        setPlayState("paused");
    });

    useVideoEventListener(videoElement, "loadeddata", () => {
        videoElement.play()
    });

    useVideoEventListener(videoElement, "error", (e) => {
        if(!videoElement.src) return;
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

            seekTo: (ts: number) => {
                videoElement.currentTime = clamp(0, ts, videoElement.duration);
            },
        }}>
            {children}
        </VideoPlayerContext.Provider>
    );
};
