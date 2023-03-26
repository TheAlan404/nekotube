import { Anchor, Box, Grid, Group, Loader, LoadingOverlay, Stack, Text, useMantineTheme } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ListRenderer from '../components/videos/ListRenderer';
import APIController from '../lib/APIController';
import { createQuery, getQuery } from '../lib/utils';

function SearchPage(props) {
	let location = useLocation();
	let [loading, setLoading] = useState(true);
	let [results, setResults] = useState([]);
	let [dym, setDym] = useState({});

	useDocumentTitle('🔎 "' + getQuery("query") + '" - LightTubeReact');

	useEffect(() => {
		setLoading(true);
		(async () => {
			let {
				// v1
				didYouMean,
				results,
				// v2
				searchResults,
				typoFixer,
			} = await APIController.search({ query: getQuery("query") });
			setResults(results || searchResults);
			setDym(didYouMean || typoFixer || {});
			setLoading(false);
		})();
	}, [location]);

	return (
		<Box w="100%">
			{loading && <Group align="center" my="md" w="100%" position='center'>
				<Loader />
				<Text>Loading...</Text>
			</Group>}
			{(dym && dym.correctedQuery) && <>
				<Text mt="md" align='center'>
					Showing results for
					{" "}
					<Text fw="bold" span>'{dym.correctedQuery}'</Text>.
					{" "}
					<Text italic span>
						Search instead for
						{" "}
						<Anchor component={Link} to={createQuery({ query: dym.originalQuery })}>
							'{dym.originalQuery}'
						</Anchor>
					</Text>
				</Text>
			</>}
			<Box mt="md">
				<ListRenderer list={results} />
			</Box>
		</Box>
	);
}

export default SearchPage
