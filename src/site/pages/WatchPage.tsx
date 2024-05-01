import { Box, Flex, Group, Stack } from "@mantine/core";
import { VideoPlayer } from "../../components/player/VideoPlayer";
import { SeparatorProps, useResizable } from "react-resizable-layout";
import { useRef } from "react";

export const WatchPage = () => {
    const sidebarOpen = false;

    const ref = useRef<HTMLDivElement>(null);
    const { position, separatorProps, endPosition } = useResizable({
        axis: "x",
        min: ref.current ? (ref.current.getBoundingClientRect().width * 0.5) : undefined,
        initial: ref.current ? (ref.current.getBoundingClientRect().width * 0.8) : undefined,
        max: ref.current ? (ref.current.getBoundingClientRect().width * 0.8) : undefined,
        containerRef: ref,
    });

    return (
        <Flex ref={ref} w="100%" h="calc(100vh - var(--app-shell-header-height) - calc(var(--app-shell-padding) * 2))">
            <Box w={sidebarOpen ? position : "100%"} h="100%">
                <VideoPlayer />
            </Box>
            {sidebarOpen && (
                <>
                    <Seperator
                        {...separatorProps}
                    />
                    <Box w={`calc(100% - ${position}px)`} bg="gray">
                        a
                    </Box>
                </>
            )}
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
