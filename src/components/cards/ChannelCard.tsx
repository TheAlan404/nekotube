import { Avatar, Group, Stack, Text } from "@mantine/core";
import { Channel } from "../../api/types/video";

export const ChannelCard = ({
    channel,
}: {
    channel: Channel,
}) => {
    return (
        <Group align="center" gap="xs">
            <Avatar
                src={(channel.thumbnails || [])[(channel.thumbnails || []).length]?.url || ``}
                imageProps={{ loading: "lazy" }}
                size="sm"
            />
            <Text>
                {channel?.title}
            </Text>
        </Group>
    );
};
