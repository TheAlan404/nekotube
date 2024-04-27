import { Box, Center, Container } from "@mantine/core";
import { VideoPlayer } from "./components/player/VideoPlayer";

function App() {

	return (
		<Container fluid>
			<Center h="99vh">
				<Box w="90%" h="90%">
					<VideoPlayer />
				</Box>
			</Center>
		</Container>
	)
}

export default App
