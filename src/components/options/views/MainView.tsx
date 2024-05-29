import { useContext, useState } from "react";
import { VideoPlayerContext } from "../../../api/player/VideoPlayerContext";
import { Divider, Grid, Space, Stack, Text } from "@mantine/core";
import { InstanceSelect } from "../comps/InstanceSelect";
import { FormatSelect } from "../comps/FormatSelect";
import { PlaybackSpeed } from "../comps/PlaybackSpeed";
import { PreferencesList } from "../comps/PreferencesList";
import { DebuggingSection } from "../comps/DebuggingSection";
import { OpenWithButton } from "../links/OpenWithButton";
import { LoopVideo } from "../comps/LoopVideo";
import { ThemeSection } from "../comps/ThemeSection";
import { FlavorOption } from "../comps/Flavor";

export const OptionsMainView = () => {
    const { videoInfo } = useContext(VideoPlayerContext);

    const loaded = !!videoInfo;

    return (
        <Grid w="100%">
            <Grid.Col span="auto">
                <Stack align="center" w="100%">
                    <Divider w="100%" label="Instance" labelPosition="left" />
                    <InstanceSelect />
                    <OpenWithButton fullWidth />
                    <Divider w="100%" label="Video" labelPosition="left" />
                    {!loaded && (
                        <Text>Video not loaded</Text>
                    )}
                    {loaded && <FormatSelect />}
                    {loaded && <PlaybackSpeed />}
                    {loaded && <LoopVideo />}
                    <Divider w="100%" label="Preferences" labelPosition="left" />
                    <PreferencesList />
                    <FlavorOption />
                    <Divider w="100%" label="Theme" labelPosition="left" />
                    <ThemeSection />
                    <Divider w="100%" label="Debugging" labelPosition="left" />
                    <DebuggingSection />
                    <Space h="20vh" />
                </Stack>
            </Grid.Col>
        </Grid>
    );
};
