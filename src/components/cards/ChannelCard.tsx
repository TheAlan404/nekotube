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
        <Grid align="center" gutter="xs" style={{ flexWrap: "nowrap" }}>
            <Grid.Col span="content">
                <Avatar
                    src={(channel.thumbnails || [])[(channel.thumbnails || []).length]?.url || ``}
                    imageProps={{ loading: "lazy" }}
                    size="sm"
                    color="violet"
                >
                    {getInitials(channel.title)}
                </Avatar>
            </Grid.Col>
            <Grid.Col span="auto">
                <TextWithTooltip lineClamp={1} fz="sm">
                    {channel?.title}
                </TextWithTooltip>
            </Grid.Col>
        </Grid>
    );
};
