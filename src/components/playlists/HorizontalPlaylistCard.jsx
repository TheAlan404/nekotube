import { AspectRatio, Avatar, Grid, Group, Image, Paper, Stack, Text, TypographyStylesProvider } from '@mantine/core'
import React from 'react'
import { Link } from 'react-router-dom';
import { createQuery } from '../../lib/utils';
import TextWithTooltip from '../util/TextWithTooltip';
import { Channel, Thumbnail } from '../cards/common';

function HorizontalPlaylistCard(props) {
	return (<Paper p={props.size ? 0 : "sm"} shadow="md" withBorder
		sx={(theme) => ({
			...theme.fn.focusStyles(),
			cursor: 'pointer',
            '&:hover': {
                backgroundColor:
                    theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
            },
		})} component={Link} to={"/watch?" + createQuery({ v: props.firstVideoId || (props.videos && props.videos[0]?.id), list: props.id })}>
		<Grid gutter={props.size}>
			<Grid.Col span="content">
				<Thumbnail {...props} />
			</Grid.Col>
			<Grid.Col span="auto">
				<Stack spacing={0}>
					<Text my={props.size && 0} py={props.size && 0}>
						<TextWithTooltip inherit fz="lg" fw={500}
							lineClamp={1}>{props.title}</TextWithTooltip>
						<Channel {...props} />
						<Text>{props.videoCountText || (props.videoCount + " videos")}</Text>
					</Text>
				</Stack>
			</Grid.Col>
		</Grid>
	</Paper>);
}

export default HorizontalPlaylistCard
