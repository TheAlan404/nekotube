import { Box, Flex, Group, Stack } from "@mantine/core";
import { VideoPlayer } from "../../components/player/VideoPlayer";
import { SeparatorProps, useResizable } from "react-resizable-layout";
import { useContext, useEffect, useRef } from "react";
import { TabsContext } from "../../components/tabs/TabsContext";
import { TabsRenderer } from "../../components/tabs/TabsRenderer";
import { usePrevious } from "@mantine/hooks";

export const WatchPage = () => {
    const { isTabsVisible: sidebarOpen } = useContext(TabsContext);
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
        setPosition(ref.current.getBoundingClientRect().width * per);
    }, [ref.current]);

    const height = "calc(100vh - var(--app-shell-header-height) - calc(var(--app-shell-padding) * 2))";

    return (
        <Flex ref={ref} w="100%" h={height}>
            <Box w={sidebarOpen ? position : "100%"} h="100%">
                <VideoPlayer />
            </Box>
            <Seperator
                style={{
                    ...separatorProps.style,
                    display: sidebarOpen ? undefined : "none",
                }}
                {...separatorProps}
            />
            <Box
                mah={height}
                style={{
                    overflow: "hidden",
                    width: sidebarOpen ? `calc(100% - ${position}px)` : "0px",
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
            w="1em"
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
