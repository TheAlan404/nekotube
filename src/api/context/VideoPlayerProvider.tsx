import { useContext, useEffect, useMemo, useState } from "react";
import { ActiveChapterList, PlayState, VideoPlayerContext } from "./VideoPlayerContext";
import { APIContext } from "./APIController";
import { VideoFormat, VideoData } from "../types/video";
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
    const [videoInfo, setVideoInfo] = useState<VideoData | null>(null);
    const [activeChapters, setActiveChapters] = useState<ActiveChapterList>({
        type: "video",
        chapters: [],
    });
    const [activeFormat, setActiveFormat] = useState<VideoFormat | null>(null);
    const [availableFormats, setAvailableFormats] = useState<VideoFormat[]>([]);
    const [playState, setPlayState] = useState<PlayState>("loading");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
            setErrorMessage(e.toString() || "Unknown Error");
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
        videoElement.src = activeFormat?.url || "";
    }, [activeFormat]);

    useVideoEventListener(videoElement, "error", (e) => {
        console.log(e);
    });

    useVideoEventListener(videoElement, "ended", () => {
        setPlayState("paused");
    });

    useVideoEventListener(videoElement, "loadeddata", () => {
        videoElement.play()
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
            setFormat: (fmt) => {
                setActiveFormat(fmt);
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
            errorMessage,
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
