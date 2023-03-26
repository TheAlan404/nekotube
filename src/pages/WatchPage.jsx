import { ActionIcon, Avatar, Box, Button, Grid, Group, Popover, Stack, Text, Title, Tooltip } from '@mantine/core';
import { useDocumentTitle, useWindowScroll } from '@mantine/hooks';
import { IconBrandYoutube, IconThumbDown, IconThumbUp } from '@tabler/icons';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CommentsList from '../components/comments/CommentsList';
import Player from '../components/player/Player';
import Tabs from '../components/Tabs';
import HorizontalVideoCard from '../components/videos/HorizontalVideoCard';
import ListRenderer from '../components/videos/ListRenderer';
import VideoInfo from '../components/videos/VideoInfo';
import { UIContext } from '../contexts/UIContext';
import { VideoContext } from '../contexts/VideoContext';
import APIController from '../lib/APIController';
import { getQuery, parseChapters } from '../lib/utils';

export default function WatchPage() {
	let location = useLocation();
	const [scroll, scrollTo] = useWindowScroll();

	let [{ jumpTo, commentsTabOpen }, set] = useContext(UIContext);

	let [video, setVideo] = useState({});
	let [player, setPlayer] = useState({});
	let [comments, setComments] = useState([]);
	let [commentsContinuation, setCommentsContinuation] = useState("");
	let [dislikeCount, setDislikeCount] = useState();

	let [chaptersOverride, setChaptersOverride] = useState([]);

	useEffect(() => {
		let v = getQuery("v");
		APIController.video(v).then(data => setVideo(data));
		APIController.player(v).then(data => setPlayer(data));
		APIController.getDislikes(v).then(data => setDislikeCount(data));

		setChaptersOverride([]);
		setComments([]);
		scrollTo({ y: 0 });
	}, [location]);

	useEffect(() => {
		if (!jumpTo) return;
		scrollTo({ y: 0 });
	}, [jumpTo]);

	useEffect(() => {
		if (!video.commentsContinuation) return;
		APIController.comments(video.commentsContinuation).then(data => {
			setCommentsContinuation(data.continuation);
			setComments(c => [...c, ...data.contents]);
		});
	}, [video.commentsContinuation]);

	return (
		<>
			<VideoContext.Provider value={{
				descChapters: parseChapters(video.description || player.details?.shortDescription || ""),
				chapters: chaptersOverride,
				setChapters: (c) => {
					setChaptersOverride(c);
				},

				dislikeCount,
				...video,
				...player,
				description: video.description || player.details?.shortDescription,

				comments,
				commentsContinuation,
			}}>
				<Grid columns={3} my="md">
					<Grid.Col sm={3} md={2}>
						<Stack>
							<Player {...player} playlistTodo />
							<VideoInfo {...({
								...video,
								description: video.description || player.details?.shortDescription,
							})} />
							<Stack spacing={0}>
								<Group position='apart'>
									<Group>
										<Title order={4}>Comments</Title>
										<Text c="dimmed">{video.commentCount} comments</Text>
									</Group>
									<Box onClick={() => set({ commentsTabOpen: true })}>
										<Text c="dimmed">Open as a tab</Text>
									</Box>
								</Group>
								{!commentsTabOpen && <CommentsList />}
							</Stack>
						</Stack>
					</Grid.Col>
					<Grid.Col sm={3} md={1}>
						<Stack>
							<Tabs />
							<ListRenderer list={video.recommended || []} />
						</Stack>
					</Grid.Col>
				</Grid>
			</VideoContext.Provider>
		</>
	);
}
