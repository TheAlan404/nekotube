import { AspectRatio, Avatar, Grid, Group, Image, Paper, Stack, Text, Tooltip, TypographyStylesProvider } from '@mantine/core'
import React from 'react'
import { Link } from 'react-router-dom';
import { createQuery } from '../../lib/utils';
import TextWithTooltip from '../util/TextWithTooltip';
import { Channel, MiniInfo } from './common';

function VideoCard(props) {
	return (<Paper p="sm" shadow="md" withBorder
		sx={(theme) => ({
			...theme.fn.focusStyles(),
			cursor: 'pointer',
			'&:hover': {
				backgroundColor:
					theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
			},
		})} component={Link} to={"/watch?" + createQuery({ v: props.id })}>
		<AspectRatio ratio={16 / 9}
			w={"100%"}
			h={"auto"}>
			<Image src={props.thumbnails[props.thumbnails.length - 1]?.url} />
		</AspectRatio>
		<Stack spacing="xs">
			<TextWithTooltip fz="lg" fw={500} lineClamp={2}>{props.title}</TextWithTooltip>
			<MiniInfo {...props} />
			<Channel {...props} />
		</Stack>
	</Paper>);
}

export default VideoCard;
