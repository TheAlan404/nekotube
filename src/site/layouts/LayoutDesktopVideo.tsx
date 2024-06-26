import { Box, Flex } from "@mantine/core";
import { VideoPlayer } from "../../components/player/VideoPlayer";
import { SeparatorProps, useResizable } from "react-resizable-layout";
import { useContext, useEffect, useRef } from "react";
import { TabsContext } from "../../components/tabs/TabsContext";
import { TabsRenderer } from "../../components/tabs/TabsRenderer";
import { useFullscreen, useHotkeys, usePrevious } from "@mantine/hooks";
import { usePreference } from "../../api/pref/Preferences";
import { VideoPlayerContext } from "../../api/player/VideoPlayerContext";
import { Spectrum } from "../../components/extra/Spectrum";

export const LayoutDesktopVideo = () => {
    const { activeFormat } = useContext(VideoPlayerContext);
    const animate = usePreference("watchPageAnimations");
    const { isTabsVisible: sidebarOpen, setTabsVisible } = useContext(TabsContext);
    const { fullscreen, toggle: toggleFullscreen } = useFullscreen();

    useHotkeys([
        ["t", () => setTabsVisible(!sidebarOpen)],
        ["f", () => toggleFullscreen()],
    ]);

    return (
        <LayoutInner
            theather={sidebarOpen}
            fullscreen={fullscreen}
            animate={animate}
            aspect={activeFormat ? (activeFormat.width / activeFormat.height) : 16/9}
        />
    );
};

const LayoutInner = ({
    theather,
    fullscreen,
    animate,
    aspect,
}: {
    theather: boolean;
    fullscreen: boolean;
    animate: boolean;
    aspect?: number;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    let nice = ref.current ? (aspect * ref.current.getBoundingClientRect().height) : null;

    const per = 0.65;
    const { position, separatorProps, setPosition } = useResizable({
        axis: "x",
        min: window.innerWidth * 0.4,
        initial: nice || (window.innerWidth * per),
        max: window.innerWidth * 0.8,
        containerRef: ref,
    });
    const prevOpen = usePrevious(theather) ?? theather;
    const isClosing = prevOpen && !theather;
    const isOpening = !prevOpen && theather;

    useEffect(() => {
        if(ref.current && aspect) setPosition(aspect * ref.current.getBoundingClientRect().height);
    }, [ref.current, aspect]);

    const height = !theather ? (
        `calc(100vh)`
    ) : (
        `calc(100vh - var(--app-shell-header-height))`
    );

    return (
        <Flex ref={ref} w="100%" h={height} style={{ overflow: "hidden", marginBottom: "0px" }}>
            <Box h="100%" style={{
                width: theather ? position : "100%",
                transition: (animate && (isOpening || isClosing)) ? "0.5s" : undefined,
            }}>
                <VideoPlayer />
            </Box>
            <Seperator
                show={theather}
                style={{
                    transition: (animate && (isOpening || isClosing)) ? "0.5s" : undefined,
                }}
                {...separatorProps}
            />
            <Box
                mah={height}
                style={{
                    overflow: "hidden",
                    width: theather ? `calc(100% - ${position}px)` : "0px",
                    marginLeft: "auto",
                    transition: (animate && (isOpening || isClosing)) ? "0.5s" : undefined,
                }}>
                <TabsRenderer panelHeight="calc(100vh - var(--app-shell-header-height) - calc(var(--app-shell-padding) * 2) - 3em)" />
            </Box>
            {false && <Spectrum
                style={{
                    position: "absolute",
                    width: "100vw",
                    height: "5em",
                    bottom: "0px",
                    overflow: "clip",
                    zIndex: "1000",
                    pointerEvents: "none",
                }}
            />}
        </Flex>
    );
};

const Seperator = (allProps: SeparatorProps & { show: boolean }) => {
    const {
        show,
        style,
        ...props
    } = allProps;

    return (
        <Box
            h="100%"
            bg="dark.4"
            className="hoverable"
            {...props}
            style={{
                ...style,
                userSelect: "none",
                cursor: "col-resize",
                ...(show ? {
                    marginLeft: "0.1em",
                    marginRight: "0.1em",
                    width: "0.5em",
                } : {}),
            }}
        />
    )
}
