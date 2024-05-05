import { Checkbox, Group, Loader, Paper, ScrollArea, Space, Stack, Text } from "@mantine/core";
import React, { useContext, useMemo } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { HorizontalVideoCard } from "../../cards/VideoCard";

export const RecommendedTab = () => {
    const { videoInfo } = useContext(VideoPlayerContext);

    const list = useMemo(() => {
        return (videoInfo?.recommended || []).map((renderer, i) => (
            <HorizontalVideoCard
                video={renderer}
                key={i}
            />
        ));
    }, [videoInfo?.recommended || []]);

    return (
        <ScrollArea w="100%" maw="100%" h="100%">
            <Stack w="100%" p="xs">
                {videoInfo ? (
                    <Stack w="100%">
                        <Paper p="sm" withBorder w="100%" bg="dark.7" style={{ position: "sticky", top: "var(--mantine-spacing-sm)", zIndex: 30 }}>
                            <Group w="100%" justify="space-between">
                                <Checkbox
                                    label="Autoplay"
                                />
                                <Text ta="end">
                                    {videoInfo.recommended.length} recommended videos
                                </Text>
                            </Group>
                        </Paper>
                        <Stack>
                            {list}
                        </Stack>
                    </Stack>
                ) : (
                    <Stack w="100%" align="center">
                        <Loader />
                        <Text>
                            Loading...
                        </Text>
                    </Stack>
                )}
                <Space h="10em" />
            </Stack>
        </ScrollArea>
    );
};
