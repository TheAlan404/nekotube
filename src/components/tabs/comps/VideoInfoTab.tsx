import { Divider, Group, Loader, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { MarkdownText } from "../../ui/MarkdownText";
import { ChannelCard } from "../../cards/ChannelCard";

export const VideoInfoTab = () => {
    const { videoInfo } = useContext(VideoPlayerContext);

    return (
        <ScrollArea w="100%" h="100%">
            <Stack w="100%" p="xs">
                {videoInfo ? (
                    <Stack w="100%">
                        <Title order={3}>
                            {videoInfo.title}
                        </Title>
                        <Group>
                            wikes and diswikes uwu
                        </Group>
                        <ChannelCard
                            channel={videoInfo.channel}
                        />
                        <Divider label="Description" />
                        {videoInfo.description ? (
                            <MarkdownText
                                text={videoInfo.description}
                            />
                        ) : (
                            <Text c="dimmed" fs="italic">
                                No description
                            </Text>
                        )}
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
