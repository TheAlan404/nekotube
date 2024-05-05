import { Grid, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { ThumbnailRender } from "./ThumbnailRender";
import { VideoInfo } from "../../api/types/video";
import { Link } from "react-router-dom";
import { ChannelCard } from "./ChannelCard";
import { TextWithTooltip } from "../ui/TextWithTooltip";
import { DateCard } from "./DateCard";
import { ViewCountCard } from "./ViewCountCard";
import { useContext, useEffect, useState } from "react";
import { usePreference } from "../../api/pref/Preferences";
import { APIContext } from "../../api/context/APIController";

export const HorizontalVideoCard = ({
    video: originalVideo,
}: {
    video: VideoInfo,
}) => {
    const { sponsorBlockApi } = useContext(APIContext);
    const useDeArrow = usePreference("useDeArrow");
    const [dearrowed, setDearrowed] = useState<VideoInfo | null>(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if(!useDeArrow) {
            setLoading(false);
            setDearrowed(null);
            return;
        }

        (async () => {
            setLoading(true);
            let res = await sponsorBlockApi.deArrow(originalVideo.id);
            setDearrowed({
                ...originalVideo,
                title: res.titles[0]?.title || originalVideo.title,
                thumbnails: [
                    {
                        width: 0,
                        height: 0,
                        url: `https://dearrow-thumb.ajay.app/api/v1/getThumbnail?videoID=${originalVideo.id}`,
                    }
                ],
            });
            setLoading(false);
        })();
    }, [useDeArrow, originalVideo.id]);

    let video = dearrowed || originalVideo;

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
                        loading={isLoading}
                    />
                </Grid.Col>
                <Grid.Col span="auto">
                    <Stack gap={0} justify="center">
                        <TextWithTooltip
                            lineClamp={2}
                            fw="bold"
                            fz="sm"
                            extra={video.title !== originalVideo.title && ("Original Title: " + originalVideo.title)}
                        >
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
