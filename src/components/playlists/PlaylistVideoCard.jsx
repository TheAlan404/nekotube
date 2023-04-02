import { AspectRatio, Box, Flex, Grid, Group, Image, Paper, Stack, Text } from '@mantine/core'
import { IconPlayerPlay } from '@tabler/icons';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { VideoContext } from '../../contexts/VideoContext';
import { createQuery } from '../../lib/utils';
import TextWithTooltip from '../util/TextWithTooltip';
import { Channel } from '../cards/common';
import HorizontalVideoCard from '../cards/HorizontalVideoCard'

const PlaylistVideoCard = (props) => {
    let { playlistIndex, playlist } = useContext(VideoContext);

    return (
        <Paper p={props.size ? 0 : "sm"} shadow="md" withBorder
            sx={(theme) => ({
                ...theme.fn.focusStyles(),
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                },
            })} component={Link} to={"/watch?" + createQuery({ v: props.id, list: playlist.playlistId, index: props.index })}>
            <Grid gutter={props.size} align="center">
                <Grid.Col span="content">
                    <Flex w="2em" h="2em" align="center" justify="center" sx={(theme) => ({
                        padding: "auto",
                        background: theme.fn.variant({ variant: "light", color: playlistIndex == props.index && "green" }).background,
                        color: theme.fn.variant({ variant: "light", color: playlistIndex == props.index && "green" }).color,
                        borderRadius: theme.fn.radius("sm"),
                        WebkitTapHighlightColor: 'transparent',
                    })}>
                        <Text>
                            {playlistIndex == props.index ? <IconPlayerPlay /> : props.index + 1}
                        </Text>
                    </Flex>
                </Grid.Col>
                <Grid.Col span="content">
                    <AspectRatio ratio={16 / 9}
                        w={(16 / 2) + "em"}
                        h={(9 / 2) + "em"}>
                        <Image src={(props.thumbnails && props.thumbnails[props.thumbnails.length - 1]?.url)
                            || ("https://img.youtube.com/vi/" + props.id + "/hqdefault.jpg")} />
                    </AspectRatio>
                </Grid.Col>
                <Grid.Col span="auto">
                    <Stack spacing={0}>
                        <Text my={props.size && 0} py={props.size && 0}>
                            <TextWithTooltip inherit fz="lg" fw={500}
                                lineClamp={2}>{props.title}</TextWithTooltip>
                            <Channel {...props} />
                        </Text>
                    </Stack>
                </Grid.Col>
            </Grid>
        </Paper>
    )
}

export default PlaylistVideoCard
