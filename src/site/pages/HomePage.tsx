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
            <Link to="/watch?v=FtutLA63Cp8">bad apple</Link>
            <Link to="/watch?v=4Bz0pYhAoFg">video with chapters</Link>
            <Link to="/watch?v=KxNOBCyGhnk">aishite, aishite, aishite</Link>
        </Stack>
    );
};
