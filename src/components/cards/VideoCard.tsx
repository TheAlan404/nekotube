import { Grid, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { ThumbnailRender } from "./ThumbnailRender";
import { VideoInfo } from "../../api/types/video";
import { Link } from "react-router-dom";
import { ChannelCard } from "./ChannelCard";
import { TextWithTooltip } from "../ui/TextWithTooltip";
import { DateCard } from "./DateCard";
import { ViewCountCard } from "./ViewCountCard";

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
            className="hoverable"
            c="var(--mantine-color-text)"
            to={`/watch?v=${video.id}`}
        >
            <Grid gutter="sm">
                <Grid.Col span="content">
                    <ThumbnailRender
                        thumbnails={video.thumbnails}
                        fallback={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                        length={video.length}
                    />
                </Grid.Col>
                <Grid.Col span="auto">
                    <Stack gap={0} justify="center">
                        <TextWithTooltip lineClamp={2} fw="bold" fz="sm">
                            {video.title}
                        </TextWithTooltip>
                        <Group>
                            {video.published && (
                                <DateCard
                                    date={video.published}
                                />
                            )}
                            {video.viewCount && (
                                <ViewCountCard
                                    viewCount={video.viewCount}
                                />
                            )}
                        </Group>
                        <ChannelCard
                            channel={video.channel}
                        />
                    </Stack>
                </Grid.Col>
            </Grid>
        </Paper>
    )
};
