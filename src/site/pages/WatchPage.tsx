import { Box, Flex } from "@mantine/core";
import { VideoPlayer } from "../../components/player/VideoPlayer";
import { SeparatorProps, useResizable } from "react-resizable-layout";
import { useContext, useEffect, useRef } from "react";
import { TabsContext } from "../../components/tabs/TabsContext";
import { TabsRenderer } from "../../components/tabs/TabsRenderer";
import { useFullscreen, useHotkeys, usePrevious } from "@mantine/hooks";
import { usePreference } from "../../api/pref/Preferences";

export const WatchPage = () => {
    const animate = usePreference("watchPageAnimations");
    const { isTabsVisible: sidebarOpen, setTabsVisible } = useContext(TabsContext);
    const { fullscreen, toggle: toggleFullscreen } = useFullscreen();

    useHotkeys([
        ["t", () => setTabsVisible(!sidebarOpen)],
        ["f", () => toggleFullscreen()],
    ]);

    return (
        <WatchPageLayout
            theather={sidebarOpen}
            fullscreen={fullscreen}
            animate={animate}
        />
    );
};

const WatchPageLayout = ({
    theather,
    fullscreen,
    animate,
}: {
    theather: boolean;
    fullscreen: boolean;
    animate: boolean;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const per = 0.65;
    const { position, separatorProps, setPosition } = useResizable({
        axis: "x",
        min: ref.current ? (ref.current.getBoundingClientRect().width * 0.5) : undefined,
        initial: ref.current ? (ref.current.getBoundingClientRect().width * per) : window.innerWidth * per,
        max: ref.current ? (ref.current.getBoundingClientRect().width * 0.8) : undefined,
        containerRef: ref,
    });
    const prevOpen = usePrevious(theather) ?? theather;
    const isClosing = prevOpen && !theather;
    const isOpening = !prevOpen && theather;

    useEffect(() => {
        if(ref.current) setPosition(ref.current.getBoundingClientRect().width * per);
    }, [ref.current]);

    const height = !theather && fullscreen ? (
        `calc(100vh - calc(var(--app-shell-padding) * 2))`
    ) : (
        `calc(100vh - var(--app-shell-header-height) - calc(var(--app-shell-padding) * 2))`
    );

    return (
        <Flex ref={ref} w="100%" h={height}>
            <Box h="100%" style={{
                width: theather ? position : "100%",
                transition: (animate && (isOpening || isClosing)) ? "0.5s" : undefined,
            }}>
                <VideoPlayer />
            </Box>
            <Seperator
                style={{
                    width: theather ? "0.5em" : "0px",
                    transition: (animate && (isOpening || isClosing)) ? "0.5s" : undefined,
                    marginLeft: theather ? "0.5em" : "0px",
                    marginRight: theather ? "0.5em" : "0px",
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
                <TabsRenderer />
            </Box>
        </Flex>
    );
};

const Seperator = (props: SeparatorProps) => {
    return (
        <Box
            h="100%"
            bg="dark"
            style={{
                userSelect: "none",
                width: "0.5em",
                ...props.style,
            }}
            {...props}
        />
    )
}
