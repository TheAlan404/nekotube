import { Box, Flex, Stack } from "@mantine/core";
import { VideoPlayer } from "../../components/player/VideoPlayer";
import { SeparatorProps, useResizable } from "react-resizable-layout";
import { useContext, useEffect, useRef, useState } from "react";
import { TabsContext } from "../../components/tabs/TabsContext";
import { TabsRenderer } from "../../components/tabs/TabsRenderer";
import { useFullscreen, useHotkeys, usePrevious } from "@mantine/hooks";
import { usePreference } from "../../api/pref/Preferences";
import { VideoPlayerContext } from "../../api/player/VideoPlayerContext";

export const WatchPageMobile = () => {
    const { activeFormat } = useContext(VideoPlayerContext);

    if(activeFormat) 
        console.log(`Aspect Ratio ${activeFormat.width} / ${activeFormat.height}`);

    return (
        <WatchPageLayout
            aspect={activeFormat ? (activeFormat.width / activeFormat.height) : 16/9}
        />
    );
};

const WatchPageLayout = ({
    aspect,
}: {
    aspect: number;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    // h = r/w
    const [height, setHeight] = useState(window.innerWidth / aspect);

    useEffect(() => {
        if(!ref.current) return;
        setHeight(ref.current.getBoundingClientRect().width / aspect);
    }, [ref.current, aspect]);

    return (
        <Stack
            gap={0}
            ref={ref}
            w="100%"
            h={`calc(100vh - var(--app-shell-header-height))`}
            style={{ overflow: "hidden" }}
        >
            <Box w="100%" style={{
                height: `${height}px`,
            }}>
                <VideoPlayer />
            </Box>
            <Box
                style={{
                    overflow: "hidden",
                    height: `calc(100% - ${height - 200}px)`,
                }}>
                <TabsRenderer isMobile />
            </Box>
        </Stack>
    );
};
