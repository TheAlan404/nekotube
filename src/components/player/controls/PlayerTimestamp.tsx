import { useContext, useState } from "react";
import { VideoPlayerContext } from "../../../api/player/VideoPlayerContext";
import { useVideoEventListener } from "../../../hooks/useVideoEventListener";
import { Button, CopyButton, Group, Text, Tooltip } from "@mantine/core";
import { secondsToTimestamp } from "../../../utils/timestamp";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowRight } from "@tabler/icons-react";
import { TabsContext } from "../../tabs/TabsContext";

export const PlayerTimestamp = () => {
    const { videoElement, activeChapters } = useContext(VideoPlayerContext);
    const { setTabsVisible, setCurrentTab } = useContext(TabsContext);
    const [showRemaining, { toggle: toggleRemaining }] = useDisclosure(false);
    const [progress, setProgress] = useState(0);
    
    useVideoEventListener(videoElement, "timeupdate", () => {
        setProgress(videoElement.currentTime);
    });
    
    const progressText = secondsToTimestamp(progress);
    const currentChapter = activeChapters.chapters[activeChapters.chapters.findIndex((x) => x.time > progress) - 1];
    
    const isMobile = useIsMobile();
    const fz = isMobile ? "xs" : "md";

    return (
        <Group
            gap={isMobile ? "5px" : "xs"}
            style={{ userSelect: "none" }}
            wrap="nowrap"
        >
            <CopyButton value={progressText}>
                {({ copied, copy }) => (
                    <Tooltip
                        label={copied ? "Copied!" : "Click to copy"}
                    >
                        <Text
                            fz={fz}
                            onClick={() => copy()} 
                            style={{ cursor: "pointer" }}
                            span
                        >
                            {progressText}
                        </Text>
                    </Tooltip>
                )}
            </CopyButton>
            <Text span fz={fz} c="dimmed">
                /
            </Text>
            <Text
                span
                fz={fz}
                c="dimmed"
                onClick={() => toggleRemaining()}
                style={{ cursor: "pointer" }}
            >
                {secondsToTimestamp(showRemaining ? (
                    Math.ceil(videoElement.duration || 0) - progress
                ) : (
                    videoElement.duration || 0
                ))} {showRemaining && "rem."}
            </Text>
            {currentChapter && (
                <Button
                    variant="subtle"
                    color="var(--mantine-color-text)"
                    size={"compact-"+fz}
                    rightSection={<IconArrowRight />}
                    onClick={() => {
                        setTabsVisible(true);
                        setCurrentTab("chapters");
                    }}
                >
                    {currentChapter.label}
                </Button>
            )}
        </Group>
    );
};
