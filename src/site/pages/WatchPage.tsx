import { Box, Flex, Group, Stack } from "@mantine/core";
import { VideoPlayer } from "../../components/player/VideoPlayer";
import { SeparatorProps, useResizable } from "react-resizable-layout";
import { useContext, useEffect, useRef } from "react";
import { TabsContext } from "../../components/tabs/TabsContext";
import { TabsRenderer } from "../../components/tabs/TabsRenderer";
import { useFullscreen, useHotkeys, usePrevious } from "@mantine/hooks";

export const WatchPage = () => {
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
        />
    );
};

const WatchPageLayout = ({
    theather,
    fullscreen,
}: {
    theather: boolean;
    fullscreen: boolean;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const per = 0.7;
    const { position, separatorProps, setPosition } = useResizable({
        axis: "x",
        min: ref.current ? (ref.current.getBoundingClientRect().width * 0.5) : undefined,
        initial: ref.current ? (ref.current.getBoundingClientRect().width * per) : undefined,
        max: ref.current ? (ref.current.getBoundingClientRect().width * 0.8) : undefined,
        containerRef: ref,
    });
    //const prevOpen = usePrevious(sidebarOpen);
    //const isClosing = prevOpen && !sidebarOpen;
    //const isOpening = !prevOpen && sidebarOpen;

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
            <Box w={theather ? position : "100%"} h="100%">
                <VideoPlayer />
            </Box>
            <Seperator
                style={{
                    ...separatorProps.style,
                    display: theather ? undefined : "none",
                }}
                {...separatorProps}
            />
            <Box
                mah={height}
                style={{
                    overflow: "hidden",
                    width: theather ? `calc(100% - ${position}px)` : "0px",
                    //transition: (isOpening || isClosing) ? "0.5s" : undefined,
                    marginLeft: "auto",
                }}>
                <TabsRenderer />
            </Box>
        </Flex>
    );
};

const Seperator = (props: SeparatorProps) => {
    return (
        <Box
            w="0.5em"
            mx="0.5em"
            h="100%"
            bg="dark"
            style={{
                ...props.style,
                userSelect: "none",
            }}
            {...props}
        />
    )
}
