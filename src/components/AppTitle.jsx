import React from 'react'
import { Group, MediaQuery, Text, UnstyledButton } from '@mantine/core';
import { IconBrandYoutube } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';

function AppTitle() {
    let navigate = useNavigate();

    return (
        <UnstyledButton onClick={() => navigate("/")}>
            <Group align="center">
                <IconBrandYoutube />
                <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
                    <Text>LightTube<Text c="dimmed" span>React</Text></Text>
                </MediaQuery>
            </Group>
        </UnstyledButton>
    );
}

export default AppTitle;