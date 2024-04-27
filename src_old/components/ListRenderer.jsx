import { Anchor, Grid, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useMantineTheme } from '@mantine/styles';
import React from 'react'
import { Link } from 'react-router-dom';
import { createQuery } from '../lib/utils';
import Comment from './comments/Comment';
import ControllableList from './ControllableList';
import HorizontalPlaylistCard from './playlists/HorizontalPlaylistCard';
import HorizontalVideoCard from './cards/HorizontalVideoCard';
import PlaylistVideoCard from './playlists/PlaylistVideoCard';
import VideoCard from './cards/VideoCard';
import useIsMobile from '../hooks/useIsMobile';

const Renderers = {
	videoRenderer: ({ useGrid, item, i }) => (<>
		{(useGrid ? <Grid.Col key={i} lg={3} md={4} sm={6} xs={6} span={12}>
			<VideoCard {...item} />
		</Grid.Col>
			: <HorizontalVideoCard {...item} key={i} />)}
	</>),

	compactVideoRenderer: ({ item, i }) => (
		<HorizontalVideoCard {...item} key={i} size="xs" />
	),

	playlistRenderer: ({ item, i }) => (<HorizontalPlaylistCard key={i} {...item} />),
	compactPlaylistRenderer: ({ item, i }) => (<HorizontalPlaylistCard key={i} {...item} size="xs" />),
	playlistPanelVideoRenderer: ({ item, i }) => (
		<PlaylistVideoCard {...item} key={i} index={i} />
	),

	commentThreadRenderer: ({ item, i }) => (<Comment {...item} key={i} />),

	// basically ads so
	compactMovieRenderer: () => <></>,

	didYouMeanRenderer: ({ item, i }) =>
		(<Text key={i}>
			Did you mean:
			{" "}
			<Anchor component={Link} to={"?" + createQuery({ query: item.correctedQuery })}>
				'{item.correctedQuery}'
			</Anchor>
		</Text>),

	messageRenderer: ({ item, i }) => (<Text key={i}>{item.message}</Text>),

	_: ({ item, i }) => (<Text>Unknown renderer: {item.type}</Text>),
};

const ListRenderer = ({
	list,
	useGrid,
}) => {
	let isMobile = useIsMobile();

	if (!list) return <></>;

	let Wrapper = (useGrid && isMobile) ? Grid : Stack;

	return (
		<>
			<ControllableList>
				<Wrapper spacing="md" w="100%" h="100%">
					{list.map((item, i) => (Renderers[item.type] || Renderers._)({
						useGrid: (useGrid && isMobile),
						item,
						i,
					}))}
				</Wrapper>
			</ControllableList>
		</>
	)
}

export default ListRenderer
