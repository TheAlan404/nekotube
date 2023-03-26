import { Autocomplete, Center, Container, Grid, Group, Header, MediaQuery } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import React, { Component, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import AppOptions from './components/AppOptions';
import AppTitle from './components/AppTitle';
import SearchBar from './components/SearchBar';
import useIsMobile from './hooks/useIsMobile';

const Spacer = () =>
	<MediaQuery smallerThan={"xs"} styles={{ display: "none" }}>
		<Grid.Col lg={2} md={1} sm={1} xs={"content"}>

		</Grid.Col>
	</MediaQuery>;

export default function App() {
	let location = useLocation();
	let isMobile = useIsMobile();

	let [useContainer, setUseContainer] = useState(location.pathname != "/watch");

	useEffect(() => {
		setUseContainer(location.pathname != "/watch");
	}, [location]);

	return (
		<>
			<Header height={{ base: 50, md: 70 }} p={{ base: "xs", md: "md" }}>
				<Grid align="center">
					<Grid.Col span="content" align="center">
						<AppTitle />
					</Grid.Col>

					<Spacer />

					<Grid.Col span="auto" align="center">
						<SearchBar />
					</Grid.Col>

					<Spacer />

					<Grid.Col span="content">
						<AppOptions />
					</Grid.Col>
				</Grid>
			</Header>
			<Container size={useContainer ? (isMobile ? "xs" : "md") : "xl"}>
				<Outlet />
			</Container>
		</>
	);
}
