import { ActionIcon, Avatar, Box, Button, Center, Grid, Group, Popover, Stack, Text, Title, Tooltip, Transition } from '@mantine/core';
import { useDocumentTitle, useWindowScroll } from '@mantine/hooks';
import { IconBrandYoutube, IconChevronDown, IconChevronRight, IconThumbDown, IconThumbUp } from '@tabler/icons';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CommentsList from '../components/comments/CommentsList';
import Player from '../components/player/Player';
import Tabs from '../components/Tabs';
import HorizontalVideoCard from '../components/videos/HorizontalVideoCard';
import ListRenderer from '../components/videos/ListRenderer';
import RecommendedList from '../components/videos/RecommendedList';
import VideoInfo from '../components/videos/VideoInfo';
import { UIContext } from '../contexts/UIContext';
import { VideoContext } from '../contexts/VideoContext';
import APIController from '../lib/APIController';
import { createQuery, getQuery, parseChapters } from '../lib/utils';

export default function WatchPage() {
	let location = useLocation();
	let navigate = useNavigate();
	const [scroll, scrollTo] = useWindowScroll();

	let [{ jumpTo }, set, tabs, tabsFn] = useContext(UIContext);

	let [isLoading, setLoading] = useState(true);
	let [video, setVideo] = useState({});
	let [player, setPlayer] = useState({});
	let [comments, setComments] = useState([]);
	let [commentsContinuation, setCommentsContinuation] = useState("");
	let [dislikeCount, setDislikeCount] = useState();

	let [chaptersOverride, setChaptersOverride] = useState([]);

	useEffect(() => {
		setLoading(true);
		let v = getQuery("v");
		APIController.video(v, {
			playlistId: getQuery("list"),
			playlistIndex: getQuery("index"),
		}).then(data => {
			if(!data.playlist) data.playlist = null;
			setVideo(data);
			setLoading(false);
			if (data.playlist) {
				tabsFn.open("playlist");
			} else {
				tabsFn.close("playlist");
			}
		});
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

	let playlistIndex = Number(getQuery("index"));

	let plPrev = () => {
		navigate({ search: createQuery({
			v: video.playlist.videos[Number(playlistIndex) - 1].id,
			list: video.playlist.playlistId,
			index: Number(playlistIndex) - 1,
		}) });
	};

	let plNext = () => {
		navigate({ search: createQuery({
			v: video.playlist.videos[playlistIndex + 2].id,
			list: video.playlist.playlistId,
			index: playlistIndex + 1,
		}) });
	};

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

				playlistIndex,
				plPrev,
				plNext,
			}}>
				<Grid columns={3} my="md">
					<Grid.Col sm={3} md={2}>
						<Stack>
							<Player {...player} playlistTodo />
							<VideoInfo {...({
								...video,
								description: video.description || player.details?.shortDescription,
							})} />
							<Stack spacing={"md"}>
								<Group position='apart'>
									<Group>
										<Title order={4}>Comments</Title>
										<Text c="dimmed">{video.commentCount} comments</Text>
									</Group>
									<Center inline sx={(theme) => ({
										cursor: "pointer",
										color: theme.fn.dimmed(),
										'&:hover': {
											color: "white",
										},
									})} onClick={() => tabs.includes("comments") ? tabsFn.filter(x => x != "comments") : tabsFn.prepend("comments")}>
										<Transition mounted={tabs.includes("comments")} transition="slide-right">
											{(styles) => <Center inline style={styles}>
												<Text>Close tab and view here</Text>
												<IconChevronDown />
											</Center>}
										</Transition>
										<Transition mounted={!tabs.includes("comments")} transition="slide-left">
											{(styles) => <Center inline style={styles}>
												<Text>Open as a tab</Text>
												<IconChevronRight />
											</Center>}
										</Transition>
									</Center>
								</Group>
								<Transition mounted={!tabs.includes("comments")} transition={"pop"}>
									{(styles) => <Box style={styles}>
										<CommentsList />
									</Box>}
								</Transition>
							</Stack>
						</Stack>
					</Grid.Col>
					<Grid.Col sm={3} md={1}>
						<Stack>
							<Tabs />
							<Group position='apart'>
								<Title order={4}>Recommended</Title>
								<Text sx={(theme) => ({
									color: theme.fn.dimmed(),
									cursor: "pointer",
									'&:hover': {
										color: "white",
									},
								})} onClick={() => {
									tabs.includes("recommended") ? tabsFn.filter(x => x != "recommended") : tabsFn.prepend("recommended")
								}}>{tabs.includes("recommended") ? "Close tab" : "Open tab"}</Text>
							</Group>
							<Transition mounted={!isLoading} transition={"slide-left"}>
								{(styles) =>
									<Box style={{
										...styles,
										overflowX: "hidden"
									}} w="100%">
										{!tabs.includes("recommended") && <RecommendedList />}
									</Box>
								}
							</Transition>
						</Stack>
					</Grid.Col>
				</Grid>
			</VideoContext.Provider>
		</>
	);
}
