import { Center, Text } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks';
import React, { Component, useState } from 'react'
import motd from '../assets/motd';

let rand = () => motd[Math.floor(Math.random() * motd.length)];

function HomePage() {
	let [text, setText] = useState(rand());

	useDocumentTitle("LightTubeReact");

	const update = () => {
		setText((a) => {
			let b;
			while(b == a) b = rand();
			return b;
		});
	};

	return (
		<>
			<Center p="lg" m="lg">
				<Text fz="lg" onClick={() => update()}>
					{text}
				</Text>
			</Center>
		</>
	);
}

export default HomePage
