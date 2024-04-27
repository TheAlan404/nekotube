import { useContext, useEffect, useMemo, useState } from "react";
import { PlayState, VideoPlayerContext } from "./VideoPlayerContext";
import { APIContext } from "./APIController";

export const VideoPlayerProvider = ({
    children
}: React.PropsWithChildren) => {
    const videoElement = useMemo(() => document.createElement("video"), []);
    const { api } = useContext(APIContext);

    const [videoID, setVideoID] = useState<string | null>(null);
    const [playState, setPlayState] = useState<PlayState>("loading");
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        videoElement.muted = muted;
    }, [muted]);

    useEffect(() => {
        videoElement.volume = volume;
    }, [volume]);

    return (
        <VideoPlayerContext.Provider value={{
            videoElement,

            videoID,
            setVideoID: (id) => setVideoID(id),

            playState,
            togglePlay() {
                setPlayState(s => s == "paused" ? "playing" : (s == "playing" ? "paused" : s));
            },
            volume,
            setVolume,
            muted,
            setMuted,
        }}>
            {children}
        </VideoPlayerContext.Provider>
    );
};
