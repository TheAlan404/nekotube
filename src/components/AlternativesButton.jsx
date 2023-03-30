import { ActionIcon, Box, Loader, Menu, Popover, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBrandYoutube } from '@tabler/icons';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import APIController from '../lib/APIController';
import { createQuery, getQueryLoc } from '../lib/utils';

const prettify = {
	yt: "YouTube",
	lighttube: "LightTube Instances",
	poketube: "PokeTube Instances",
};

const icons = {
	yt: <IconBrandYoutube />,
	lighttube: "LT",
	poketube: "PT",
}

export default function AlternativesButton() {
	let location = useLocation();
	let [opened, setOpened] = useState(false);
	let [alts, setAlts] = useState(APIController.alternatives || []);

	useEffect(() => {
		if(!opened) return;
		if (alts.length == 0) {
			APIController.getAlternatives().then((a) => {
				setAlts(a);
			});
		};
	}, [opened]);

	return (
		<>
			<Menu opened={opened} onChange={setOpened} position="right">
				<Menu.Target>
					<Tooltip label="Switch sites...">
						<ActionIcon size="lg" variant='light'>
							<IconBrandYoutube />
						</ActionIcon></Tooltip>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Item
						icon={icons.yt}
						component="a"
						href={"https://youtube.com/watch?" + createQuery({ v: getQueryLoc(location, "v") })}>
						YouTube
					</Menu.Item>
					{alts.length ? <>
						{alts.map(({ type, list }, i) => (
							<Box key={i}>
								<Menu.Label>{prettify[type]}</Menu.Label>
								{list.map((alt, ii) => (
									<Menu.Item
										key={ii}
										icon={icons[type]}
										component="a"
										href={alt.host + "/watch?" + createQuery({ v: getQueryLoc(location, "v") })}>
										{alt.name}
									</Menu.Item>
								))}
							</Box>
						))}
					</> : <Loader />}
				</Menu.Dropdown>
			</Menu>
		</>
	);
}
