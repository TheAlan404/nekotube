import { Avatar, Grid, Group, Stack, Text } from "@mantine/core";
import { Channel } from "../../api/types/channel";
import { getInitials } from "../../utils/getInitials";
import { TextWithTooltip } from "../ui/TextWithTooltip";

export const ChannelCard = ({
    channel,
}: {
    channel: Channel,
}) => {
    let thumbnails = channel.thumbnails || [];
    let thumbnail = thumbnails[thumbnails.length-1] || thumbnails[0];

    return (
        <Group align="center" gap="xs" wrap="nowrap">
            <Avatar
                src={thumbnail?.url}
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
