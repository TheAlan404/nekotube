import { Loader, ScrollArea, Stack, Text } from "@mantine/core";
import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { HorizontalVideoCard } from "../../cards/VideoCard";

export const RecommendedTab = () => {
    const { videoInfo } = useContext(VideoPlayerContext);

    return (
        <ScrollArea w="100%" h="100%">
            <Stack w="100%" p="xs">
                {videoInfo ? (
                    <Stack w="100%">
                        <Text ta="end" c="dimmed">
                            {videoInfo.recommended.length} recommended videos
                        </Text>
                        {videoInfo.recommended.map((renderer, i) => (
                            <HorizontalVideoCard
                                video={renderer}
                                key={i}
                            />
                        ))}
                    </Stack>
                ) : (
                    <Stack w="100%" align="center">
                        <Loader />
                        <Text>
                            Loading...
                        </Text>
                    </Stack>
                )}
            </Stack>
        </ScrollArea>
    );
};
