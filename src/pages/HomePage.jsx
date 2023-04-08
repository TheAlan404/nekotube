import { Center, Text } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks';
import React, { Component, useState } from 'react'
import motd from '../assets/motd';

let rand = (neg) => {
	let list = motd.filter(x => Array.isArray(neg) ? !neg.includes(x) : x !== neg);
	let val = list[Math.floor(Math.random() * list.length)];
	return val;
};

const UsedListBuffer = Math.floor(motd.length / 3);

function HomePage() {
	let [usedList, setUsedList] = useState([]);
	let [text, setText] = useState(rand());

	useDocumentTitle("LightTubeReact");

	const update = () => {
		let [i, next] = getRandom();
		addToBuffer(i);
		setText(next);
	};

	const getRandom = () => {
		let list = motd.filter((x, i) => !usedList.includes(i));
		let i = Math.floor(Math.random() * list.length);
		return [motd.indexOf(list[i]), list[i]];
	};

	const addToBuffer = (i) => setUsedList((li) => {
		if(li.includes(i)) return li;
		let list = [...li, i];
		if (list.length > UsedListBuffer)
			list.shift();
		return list;
	});

	return (
		<>
			<Center p="lg" m="lg" style={{ cursor: "pointer", userSelect: "none" }}>
				{
					typeof text == "string" ?
						<Text fz="lg" onClick={() => update()}>
							{text}
						</Text>
					: text(update)
				}
			</Center>
		</>
	);
}

export default HomePage
