import { Box, Flex } from "@mantine/core";
import { VideoPlayer } from "../../components/player/VideoPlayer";
import { SeparatorProps, useResizable } from "react-resizable-layout";
import { useContext, useEffect, useRef } from "react";
import { TabsContext } from "../../components/tabs/TabsContext";
import { TabsRenderer } from "../../components/tabs/TabsRenderer";
import { useFullscreen, useHotkeys, usePrevious } from "@mantine/hooks";
import { usePreference } from "../../api/pref/Preferences";
import { VideoPlayerContext } from "../../api/player/VideoPlayerContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import { WatchPageMobile } from "./WatchPageMobile";
import { WatchPageDesktop } from "./WatchPageDesktop";

export const WatchPage = () => {
    const isMobile = useIsMobile();

    return (
        isMobile ? <WatchPageMobile /> : <WatchPageDesktop />
    );
};
