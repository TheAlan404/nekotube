import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { PlayState, VideoPlayerContext } from "./VideoPlayerContext";
import { APIContext } from "../provider/APIController";
import { VideoData } from "../types/video";
import { VideoFormat } from "../types/format";
import { useVideoEventListener } from "../../hooks/useVideoEventListener";
import { parseChapters } from "../../utils/parseChapters";
import { clamp } from "@mantine/hooks";
import { PreferencesContext } from "../pref/Preferences";
import { ActiveChapterList } from "../types/chapter";
import { useNavigate } from "react-router-dom";

export const VideoPlayerProvider = ({
    children
}: React.PropsWithChildren) => {
    const videoElement = useMemo(() => {
        let el = document.createElement("video");
        el.autoplay = true;
        el.style.width = "100%";
        el.style.height = "100%";
        return el;
    }, []);
    const {
        api,
        currentInstance,
        dislikesApi,
        sponsorBlockApi,
    } = useContext(APIContext);
    const { pref } = useContext(PreferencesContext);

    const navigate = useNavigate();

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
    const [volume, setVolume] = useState(JSON.parse(localStorage.getItem("nekotube:volume") ?? "1"));
    const [muted, setMuted] = useState(false);
    const [autoplayDate, setAutoplayDate] = useState<Date | null>(null);
    const autoplayRef = useRef<number>();

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
        localStorage.setItem("nekotube:volume", JSON.stringify(volume));
    }, [volume]);

    const fetchVideoInfo = async () => {
        videoElement.currentTime = 0;
        setPlayState("loading");
        setAvailableFormats([]);
        setActiveFormat(null);
        setVideoInfo(null);
        setError(null);
        setActiveChapters({
            chapters: [],
            type: "video",
        });
        if(!videoID) return;

        //new SponsorBlockAPI().fetchSegments(videoID).then(console.log);
        
        try {
            let info = await api.getVideoInfo(videoID);

            let dislikesResponse = pref.useReturnYoutubeDislike ? (
                await dislikesApi.getDislikes(videoID)
            ) : (
                null
            );

            info = {
                ...info,
                dislikeCount: dislikesResponse?.dislikes,
                published: info.published || dislikesResponse?.dateCreated ? (
                    new Date(dislikesResponse?.dateCreated)
                ) : null,
            };

            setVideoInfo(info);

            console.log("Fetched VideoData", info);

            let chapters = parseChapters(info.description);
            setActiveChapters({
                type: "video",
                chapters,
            });

            if(info.formats.length) {
                setAvailableFormats(info.formats);
                setActiveFormat(info.formats
                    .filter(f => f.type == "basic")
                    .filter(f => currentInstance.type != "invidious" || f.isProxied)
                    .findLast(x=>x)
                    || info.formats[0]
                );
            } else {
                setError(new Error(`No available formats found :(`));
            }

            navigator.mediaSession.metadata = new MediaMetadata({
                title: info.title,
                artist: info.channel.title,
                album: "NekoTube",
                artwork: info.thumbnails.map(({ width, height, url }) => ({
                    src: url,
                    sizes: `${width}x${height}`,
                })),
            });
        } catch(e) {
            console.log(e);
            setError(e);
            setPlayState("error");
        }
    };

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

    useEffect(() => {
        fetchVideoInfo();
    }, [currentInstance, videoID]);

    useEffect(() => {
        console.log("Setting URL to", activeFormat?.url);
        let t = videoElement.currentTime;
        if(videoElement.src != (activeFormat?.url || "_")) videoElement.src = (activeFormat?.url || "_");
        videoElement.currentTime = t;
    }, [activeFormat]);

    useVideoEventListener(videoElement, "ended", () => {
        if(!pref.autoplay) return;

        let waitDuration = 10 * 1000;
        console.log("Will autoplay in", waitDuration);
        setAutoplayDate(new Date(Date.now() + waitDuration));
        clearTimeout(autoplayRef.current);
        autoplayRef.current = setTimeout(() => {
            setAutoplayDate(null);
            clearTimeout(autoplayRef.current);

            // #MARKER
            let id = videoInfo.recommended[0]?.id;
            if(!id) return;

            navigate({ pathname: "/watch", search: "?"+new URLSearchParams({ v: id }).toString() });
        }, waitDuration);
    });

    useVideoEventListener(videoElement, "loadeddata", () => {
        setPlayState("paused");
    });

    useVideoEventListener(videoElement, "error", (e) => {
        if(!videoElement.src || videoElement.src.endsWith("/_")) return;
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

    useVideoEventListener(videoElement, "timeupdate", () => {
        navigator.mediaSession.setPositionState({
            duration: videoElement.duration,
            playbackRate: videoElement.playbackRate,
            position: videoElement.currentTime,
        });
    });

    useEffect(() => {
        navigator.mediaSession.setActionHandler("play", () => videoElement.play());
        navigator.mediaSession.setActionHandler("pause", () => videoElement.pause());
        navigator.mediaSession.setActionHandler("seekto", (details) => {
            if(details.fastSeek) {
                videoElement.fastSeek(details.seekTime);
            } else {
                seekTo(details.seekTime);
            }
        });
        navigator.mediaSession.setActionHandler("seekbackward", (details) => seekTo(videoElement.currentTime - (details.seekOffset || 10)));
        navigator.mediaSession.setActionHandler("seekforward", (details) => seekTo(videoElement.currentTime + (details.seekOffset || 10)));
    }, []);

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
            setActiveChapters: (source, chapters = [], id = "") => {
                if(source == "video") {
                    setActiveChapters({
                        type: "video",
                        chapters: parseChapters(videoInfo?.description || ""),
                    });
                } else {
                    setActiveChapters({
                        type: source,
                        chapters,
                        id,
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

            autoplayDate,
            cancelAutoplay: () => {
                clearTimeout(autoplayRef.current);
                setAutoplayDate(null);
            },
        }}>
            {children}
        </VideoPlayerContext.Provider>
    );
};
