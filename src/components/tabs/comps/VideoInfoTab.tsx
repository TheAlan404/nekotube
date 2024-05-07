import { Divider, Group, Loader, ScrollArea, Space, Stack, Text, Title } from "@mantine/core";
import { useContext } from "react";
import { VideoPlayerContext } from "../../../api/player/VideoPlayerContext";
import { MarkdownText } from "../../ui/MarkdownText";
import { ChannelCard } from "../../cards/ChannelCard";
import { VotingCard } from "../../cards/VotingCard";
import { DateCard } from "../../cards/DateCard";
import { ViewCountCard } from "../../cards/ViewCountCard";

export const VideoInfoTab = () => {
    const { videoInfo } = useContext(VideoPlayerContext);

    return (
        <ScrollArea w="100%" h="100%" type="scroll" offsetScrollbars>
            <Stack w="100%" p="xs">
                {videoInfo ? (
                    <Stack w="100%">
                        <Title order={3}>
                            {videoInfo.title}
                        </Title>
                        <Group>
                            <VotingCard
                                {...videoInfo}
                            />
                            <Group wrap="nowrap">
                                <DateCard
                                    date={videoInfo.published}
                                />
                                <ViewCountCard
                                    viewCount={videoInfo.viewCount}
                                    size={"md"}
                                />
                            </Group>
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
                        <Space h="10em" />
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
