import { Avatar, Grid, Group, Stack, Text } from "@mantine/core";
import { Channel } from "../../api/types/Channel";
import { getInitials } from "../../utils/getInitials";
import { TextWithTooltip } from "../ui/TextWithTooltip";

export const ChannelCard = ({
    channel,
}: {
    channel: Channel,
}) => {
    return (
        <Group align="center" gap="xs" wrap="nowrap">
            <Avatar
                src={(channel.thumbnails || [])[(channel.thumbnails || []).length]?.url || ``}
                imageProps={{ loading: "lazy" }}
                size="sm"
            >
                {getInitials(channel.title)}
            </Avatar>
            <TextWithTooltip lineClamp={1} fz="sm">
                {channel?.title}
            </TextWithTooltip>
        </Group>
    );
};
