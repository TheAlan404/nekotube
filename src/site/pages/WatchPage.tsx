import { Box, Flex } from "@mantine/core";
import { VideoPlayer } from "../../components/player/VideoPlayer";
import { SeparatorProps, useResizable } from "react-resizable-layout";
import React, { useContext, useEffect, useRef } from "react";
import { TabsContext } from "../../components/tabs/TabsContext";
import { TabsRenderer } from "../../components/tabs/TabsRenderer";
import { useFullscreen, useHotkeys, usePrevious } from "@mantine/hooks";
import { usePreference } from "../../api/pref/Preferences";
import { VideoPlayerContext } from "../../api/player/VideoPlayerContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import { LayoutDesktopVideo } from "../layouts/LayoutDesktopVideo";
import { LayoutMobileVideo } from "../layouts/LayoutMobileVideo";
import { UIFlavor } from "../../components/tabs/TabTypes";
import { LayoutDesktopMusic } from "../layouts/LayoutDesktopMusic";

export const WatchPage = () => {
    const { flavor } = useContext(TabsContext);
    const isMobile = useIsMobile();

    return (
        ({
            "d:video": <LayoutDesktopVideo />,
            "m:video": <LayoutMobileVideo />,
            "d:music": <LayoutDesktopMusic />,
        } as Record<`${"m" | "d"}:${UIFlavor}`, React.ReactNode>)[`${isMobile ? "m" : "d"}:${flavor}`]
    );
};
