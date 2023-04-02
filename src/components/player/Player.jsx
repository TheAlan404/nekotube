import { ActionIcon, AspectRatio, Box, Center, Flex, Group, Overlay, Progress, Slider, Stack, Text, Tooltip } from '@mantine/core';
import { useDisclosure, useDocumentTitle, useFullscreen, useHotkeys, useListState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconMaximize, IconPlayerPause, IconPlayerPlay, IconPlayerTrackNext, IconPlayerTrackPrev } from '@tabler/icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PlayerContext } from '../../contexts/PlayerContext';
import { SettingsContext } from '../../contexts/SettingsContext';
import { UIContext } from '../../contexts/UIContext';
import { VideoContext } from '../../contexts/VideoContext';
import APIController from '../../lib/APIController';
import { cap, toTimestamp } from '../../lib/utils';
import ChapterPopup from './ChapterPopup';
import PlayerLayout from './PlayerLayout';

const filterUsableVideo = f => f.mimeType.startsWith("video/mp4") || f.mimeType.startsWith("video/webm");

export default function Player() {
    let location = useLocation();
    let video = useContext(VideoContext);
    let [{ useProxy, saveProgress }] = useContext(SettingsContext);
    let [{ jumpTo, currentChapter, hasChapters, infoPopup }, set] = useContext(UIContext);

    let [formats, handlers] = useListState([]);
    let [formatIndex, setFormatIndex] = useState(0);
    let [errored, setErrored] = useState(false);
    let [errorMessage, setErrorMessage] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [muted, setMuted] = useState(false);
    const [paused, { toggle: togglePause, close: play, open: pause }] = useDisclosure(true);

    const {
        ref: fullscreenRef,
        toggle: toggleFullscreen,
        fullscreen: isFullscreen
    } = useFullscreen();

    let ref = useRef();

    // -- Format handling --

    useEffect(() => {
        let list = [...(video.formats || []), ...(video.adaptiveFormats || [])]
            .filter(filterUsableVideo);
        
        if(useProxy && APIController.canUseProxy()) {
            for(let item in list) {
                if(!item.itag) continue;
                if(list.some(x => x.proxy && x.itag == item.itag)) continue;

                list.push({
                    proxy: true,
                    url: APIController.getProxyURL(video.id, item.itag),
                    ...item,
                });
            }
        };

        handlers.setState(list);
        setFormatIndex(0);
        setErrored(false);
    }, [video.formats]);

    useEffect(() => {
        if(errored) {
            if(formatIndex >= formats.length) {
                showNotification({
                    title: "Error",
                    message: "Can't find a working format to play the video.",
                    color: "red",
                });
                setErrorMessage("Can't find a working format...");
            } else {
                handlers.setItemProp(formatIndex, "error", true);
                setFormatIndex(i => i + 1);
            };
        } else setFormatIndex(0);
    }, [formats, errored]);

    const selectedFormat = formats[formatIndex];

    // -- progress saving --

    useEffect(() => {
        if(!ref.current) return;
        let n = localStorage.getItem("ltr-progress-" + video.id);
        if(n && n > 0 && !isNaN(n)) {
            n = Number(n);
            seekTo(n);
            showNotification({
                message: "Continuing from " + toTimestamp(n),
                color: "green",
            });
        };
        //ref.current.play().catch(() => {});
        play();
    }, [video.id]);

    useEffect(() => {
        const onUnload = () => {
            if(saveProgress && !ref.current?.ended) {
                localStorage.setItem("ltr-progress-" + video.id, progress);
                showNotification({
                    message: "Saved your progress! See you later",
                    color: "cyan",
                });
            }
        };

        window.addEventListener("beforeunload", onUnload);
        return () => window.removeEventListener("beforeunload", onUnload);
    }, []);

    useEffect(() => {
        if(jumpTo === undefined) return;
        seekTo(jumpTo, true);
    }, [jumpTo]);

    useEffect(() => {
        if(saveProgress && !ref.current?.ended) localStorage.setItem("ltr-progress-" + video.id, progress);
    }, [location]);

    useEffect(() => {
        if(ref.current) ref.current.onended = () => localStorage.removeItem("ltr-progress-" + video.id);
    }, [ref]);

    // -- player states --

    useEffect(() => {
        if(!ref.current) {
            showNotification({
                id: "refnull",
                title: "Error",
                message: "Video ref doesn't exist",
                color: "orange",
            });
            return;
        };
        if(!paused && ref.current.paused)
            ref.current.play();
        else if(paused && !ref.current.paused)
            ref.current.pause();
    }, [paused]);

    useEffect(() => {
        if(!ref.current) {
            showNotification({
                title: "Error",
                id: "refnull",
                message: "Video ref doesn't exist",
                color: "orange",
            });
            return;
        };
        ref.current.volume = cap(volume);
        if(volume <= 0) {
            setMuted(true);
            setVolume(0.1);
        };
    }, [volume]);

    // -- chapters control --

    useEffect(() => {
        let list = ([
            video.chapters,
            video.descChapters,
        ].find(x => x.length));
        if(!list) {
            if(currentChapter || hasChapters) set({ currentChapter: null, hasChapters: false });
            return;
        };
        let chp = list.findLast(x => x.time <= progress);
        if(!hasChapters) set({ hasChapters: true });
        if(!chp) {
            if(currentChapter) set({ currentChapter: null });
            return;
        };
        if(!currentChapter || currentChapter.i != chp.i) set({ currentChapter: chp });
    }, [progress, video.chapters, video.descChapters]);

    // hotkeys etc

    const runWithPopup = (fn, popup) => {
        set({ infoPopup: popup });
        fn();
    };

    useHotkeys([
        ["space", () => runWithPopup(togglePause, paused ? "Play" : "Paused")],
        ["k", () => runWithPopup(togglePause, paused ? "Play" : "Paused")],
        ["f", toggleFullscreen],
        ["m", () => runWithPopup(() => setMuted(m => !m), muted ? "Unmuted" : "Muted")],
        ["ArrowUp", () => setVolume(v => cap(v + 0.1))],
        ["ArrowDown", () => setVolume(v => cap(v - 0.1))],
        ["ArrowLeft", () => seekTo(cap(progress - 5, duration, 0))],
        ["ArrowRight", () => seekTo(cap(progress + 5, duration, 0))],

        ...(hasChapters ? [
            ["shift + ArrowRight", () => chapNext()],
            ["shift + ArrowLeft", () => chapPrev()],
        ] : []),
    ]);

    let chapNext = () => {
        let list = [
            video.chapters,
            video.descChapters,
        ].find(x => x.length);
        if(!list) return;

        let chp = list[currentChapter.i + 1];
        if(!chp) return;

        seekTo(chp.time, true);
    };

    let chapPrev = () => {
        let list = [
            video.chapters,
            video.descChapters,
        ].find(x => x.length);
        if(!list) return;

        if((progress - currentChapter.time) > 5) {
            seekTo(currentChapter.time, true);
            return;
        };

        let chp = list[currentChapter.i - 1];
        if(!chp) return;

        seekTo(chp.time, true);
    };

    const seekTo = (pos, isPercise = false) => {
        if(isPercise) {
            if (ref.current) ref.current.currentTime = pos;
        } else ref.current?.fastSeek(pos);
    };

    // -- title --

    useDocumentTitle((paused ? "⏸︎ " : (muted ? "🔇 " : "")) + video.title + " - LightTubeReact");
    
    return (
        <>
            <PlayerContext.Provider value={{
                formats,
                formatIndex,
                setFormatIndex,

                paused,
                togglePause,
                pause,
                play,
                duration,
                progress,
                
                seekTo,

                toggleFullscreen,
                isFullscreen,

                volume,
                setVolume,
                muted,
                setMuted,
            }}>
                <Box ref={fullscreenRef}>
                    <AspectRatio ratio={16 / 9} mx="auto">
                        {errorMessage ? <div>
                            <Center>
                                <Text c="red">
                                    {errorMessage}
                                </Text>
                            </Center>
                        </div> : <video
                            src={selectedFormat?.url}
                            ref={ref}
                            onTimeUpdate={(e) => setProgress(e.target.currentTime)}
                            onDurationChange={(e) => setDuration(e.target.duration)}
                            onError={(e) => {
                                console.log("Video element errored!", e);
                                showNotification({
                                    message: "Video errored",
                                    color: "yellow",
                                });
                                setErrored(true);
                            }}
                            volume={volume}
                            muted={muted} />}
                        <PlayerLayout />
                    </AspectRatio>
                </Box>
            </PlayerContext.Provider>
        </>
    );
}
