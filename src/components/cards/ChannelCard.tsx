import { Avatar, Grid, Group, Stack, Text } from "@mantine/core";
import { Channel } from "../../api/types/Channel";

export const ChannelCard = ({
    channel,
}: {
    channel: Channel,
}) => {
    return (
        <Grid align="center" gutter="xs">
            <Grid.Col span="content">
                <Avatar
                    src={(channel.thumbnails || [])[(channel.thumbnails || []).length]?.url || ``}
                    imageProps={{ loading: "lazy" }}
                    size="sm"
                />
            </Grid.Col>
            <Grid.Col span="auto">
                <Text>
                    {channel?.title}
                </Text>
            </Grid.Col>
        </Grid>
    );
};
