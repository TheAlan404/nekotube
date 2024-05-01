import { Grid, Paper, Stack, Text, Title } from "@mantine/core";
import { ThumbnailRender } from "./ThumbnailRender";
import { VideoInfo } from "../../api/types/video";
import { Link } from "react-router-dom";
import { ChannelCard } from "./ChannelCard";

export const HorizontalVideoCard = ({
    video,
}: {
    video: VideoInfo,
}) => {
    return (
        <Paper
            withBorder
            p="xs"
            shadow="md"
            component={Link}
            c="var(--mantine-color-text)"
            to={`/watch?v=${video.id}`}
        >
            <Grid gutter="sm">
                <Grid.Col span="content">
                    <ThumbnailRender
                        thumbnails={video.thumbnails}
                        fallback={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    />
                </Grid.Col>
                <Grid.Col span="auto">
                    <Stack gap="xs">
                        <Text fw="bold">
                            {video.title}
                        </Text>
                        <ChannelCard
                            channel={video.channel}
                        />
                    </Stack>
                </Grid.Col>
            </Grid>
        </Paper>
    )
};
