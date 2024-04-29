import { Box, Stack } from "@mantine/core";
import { VideoPlayer } from "../../components/player/VideoPlayer";

export const WatchPage = () => {
    return (
        <Stack w="100%">
            <Box w="80vw" h="80vh">
                <VideoPlayer />
            </Box>
        </Stack>
    );
};
