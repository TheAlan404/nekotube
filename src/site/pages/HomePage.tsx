import { Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";

export const HomePage = () => {
    return (
        <Stack align="center" w="100%">
            <Title>
                NekoTube
            </Title>
            <Text>
                alternative YouTube video player by dennis
            </Text>
            <Link to="/watch">/watch</Link>
        </Stack>
    );
};
