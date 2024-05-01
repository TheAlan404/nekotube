import { useContext, useState } from "react";
import { VideoPlayerContext } from "../../../api/context/VideoPlayerContext";
import { Divider, Grid, Space, Stack, Text } from "@mantine/core";
import { InstanceSelect } from "../comps/InstanceSelect";
import { FormatSelect } from "../comps/FormatSelect";
import { PlaybackSpeed } from "../comps/PlaybackSpeed";
import { PreferencesList } from "../comps/PreferencesList";

export const OptionsMainView = () => {
    const { playState } = useContext(VideoPlayerContext);

    const loaded = playState !== "error" && playState !== "loading";

    return (
        <Grid w="100%">
            <Grid.Col span="auto">
                <Stack align="center" w="100%">
                    <Divider w="100%" label="Instance" labelPosition="left" />
                    <InstanceSelect />
                    <Divider w="100%" label="Video" labelPosition="left" />
                    {!loaded && (
                        <Text>Video not loaded</Text>
                    )}
                    {loaded && <FormatSelect />}
                    {loaded && <PlaybackSpeed />}
                    <Divider w="100%" label="Preferences" labelPosition="left" />
                    <PreferencesList />
                    <Space h="20vh" />
                </Stack>
            </Grid.Col>
        </Grid>
    );
};
