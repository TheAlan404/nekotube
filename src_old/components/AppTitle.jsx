import React from 'react'
import { Box, Center, Group, MediaQuery, Text, UnstyledButton } from '@mantine/core';
import { IconBrandYoutube } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';

function AppTitle() {
    let navigate = useNavigate();

    return (
        <UnstyledButton onClick={() => navigate("/")}>
            <Center inline>
                <Group>
                    <Box c="grape.9">
                        <IconBrandYoutube />
                    </Box>
                    <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                        <Text>LightTube<Text c="dimmed" span>React</Text></Text>
                    </MediaQuery>
                </Group>
            </Center>
        </UnstyledButton>
    );
}

export default AppTitle;